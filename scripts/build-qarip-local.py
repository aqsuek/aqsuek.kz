#!/usr/bin/env python3
"""Local-only Qarip catalog builder: fonts.json, detail pages, lazy-font CSS split, reels route."""
from __future__ import annotations

import json
import re
import shutil
import unicodedata
from collections import defaultdict
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site" / "qarip"
PAGE_JS = SITE / "_next" / "static" / "chunks" / "page-Bmqvxf-C.js"
CSS = SITE / "_next" / "static" / "css" / "index.Bx9punr5.css"
INDEX = SITE / "index.html"
DATA = SITE / "data" / "fonts.json"
FONT_DIR = SITE / "font"
REELS = SITE / "reels" / "index.html"
STORIES = SITE / "stories" / "index.html"

STYLE_MAP = {
    "Санс-сериф": "Sans Serif",
    "Сериф": "Serif",
    "Дисплей": "Display",
    "Қолжазба": "Handwritten",
    "Моно": "Monospace",
}
GENERIC_AUTHORS = {
    "жеке жинақ",
    "жеке жинақ · архив",
    "жеке жинак",
}
# Curated from Reels/Stories caption research; only fonts already in the local archive.
STORIES_SLUGS = {
    "montserrat",
    "proxima-nova",
    "helvetica-neue-w1g",
    "gilroy",
    "gotham",
    "noto-sans",
    "pt-sans-pro",
    "igra-sans",
    "cera-round-pro",
    "kz-unbounded",
    "kz-agency-gothic",
    "impactkz",
    "supermolot",
    "dela-gothic-one",
    "intro",
    "arial-black-kz",
    "kz-furore",
    "kz-block-pro-condensed",
    "vag-rounded-next",
    "comfortaa",
    "sf-font",
    "neue-frutiger-world",
    "wayfinding-sans-pro",
    "movavi-grotesque-black",
    "samsung-one-700",
    "formular",
    "euclid-flex",
    "giorgio-sans",
    "days",
    "engine",
}
PREVIEW = "Қазақ тілі — ғажап тіл. Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І"
OLD_PREVIEW = "Қазақ елі — тәуелсіз, заманауи және болашаққа сенімді ел. Ә Ғ Қ Ң Ө Ұ Ү Һ І"
DISCLAIMER = (
    "Qarip қаріптердің қазақ әліпбиін қолдауын тексеруге және оларды табуды жеңілдетуге арналған. "
    "Қаріптердің авторлық құқықтары тиісті құқық иелеріне тиесілі. "
    "Коммерциялық қолданар алдында әр қаріптің лицензия шарттарын тексеріңіз."
)
GLYPHS = "Әә · Ғғ · Ққ · Ңң · Өө · Ұұ · Үү · Һһ · Іі"


def clean(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and value != value:
        return ""
    text = str(value).strip()
    if not text or text.lower() in {"nan", "undefined", "null"}:
        return ""
    return text


def author_of(maker: str) -> str:
    text = clean(maker)
    if not text or text.lower() in GENERIC_AUTHORS:
        return ""
    return re.sub(r"\s*·\s*архив$", "", text, flags=re.I).strip()


def slugify(name: str, download: str) -> str:
    raw = unicodedata.normalize("NFKD", name)
    raw = "".join(ch for ch in raw if not unicodedata.combining(ch))
    slug = re.sub(r"[^a-z0-9]+", "-", raw.lower()).strip("-")
    if not slug:
        slug = Path(download).stem.lower()
        slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    return slug or "font"


def parse_fonts() -> list[dict]:
    js = PAGE_JS.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    faces = {
        fam.strip(): src.strip()
        for fam, src in re.findall(r"@font-face\{font-family:([^;]+);src:url\(([^)]+)\)", css)
    }
    objs = re.findall(
        r"\{name:`([^`]*)`,maker:`([^`]*)`,style:`([^`]*)`,family:`([^`]*)`,download:`([^`]*)`,local:!0\}",
        js,
    )
    used: dict[str, int] = {}
    fonts: list[dict] = []
    for name, maker, style, family, download in objs:
        name, maker, style, family, download = map(clean, (name, maker, style, family, download))
        if not name:
            continue
        fam = family.strip('"').strip("'")
        slug = slugify(name, download)
        used[slug] = used.get(slug, 0) + 1
        if used[slug] > 1:
            slug = f"{slug}-{used[slug]}"
        fonts.append(
            {
                "slug": slug,
                "name": name,
                "maker": maker,
                "author": author_of(maker),
                "style": style or "Дисплей",
                "category": STYLE_MAP.get(style, style or "Display"),
                "family": fam,
                "download": download,
                "preview": faces.get(fam, ""),
                "license": "check",
                "local": True,
            }
        )
        if slug in STORIES_SLUGS:
            fonts[-1]["useCase"] = "stories"
            fonts[-1]["tags"] = "stories reels рилс субтитр caption"
    by_style: dict[str, list[str]] = defaultdict(list)
    for font in fonts:
        by_style[font["style"]].append(font["slug"])
    for font in fonts:
        font["similar"] = [slug for slug in by_style[font["style"]] if slug != font["slug"]][:4]
    return fonts


def strip_font_face() -> None:
    css = CSS.read_text(encoding="utf-8")
    stripped, n = re.subn(r"@font-face\{[^}]+\}", "", css)
    CSS.write_text(stripped, encoding="utf-8")
    print(f"stripped {n} @font-face rules")


def patch_unique_strings() -> None:
    js = PAGE_JS.read_text(encoding="utf-8")
    js = js.replace(OLD_PREVIEW, PREVIEW)
    js = js.replace("Қазақша дизайнға арналған ашық каталог.", DISCLAIMER)
    PAGE_JS.write_text(js, encoding="utf-8")
    html = INDEX.read_text(encoding="utf-8")
    html = html.replace(OLD_PREVIEW, PREVIEW)
    html = html.replace("Қазақша дизайнға арналған ашық каталог.", DISCLAIMER)
    html = html.replace("?v=fix30", "?v=fix31")
    html = html.replace("?v=fix29", "?v=fix31")
    html = html.replace("?v=fix28", "?v=fix31")
    if 'catalog-pages.css' not in html:
        html = html.replace(
            "</head>",
            '<link rel="stylesheet" href="/qarip/catalog-pages.css?v=fix31"/></head>',
            1,
        )
    if "qarip-lib.js" not in html:
        html = html.replace(
            '<script src="/qarip/catalog-filter-mobile2.js',
            '<script src="/qarip/qarip-lib.js?v=fix31"></script><script src="/qarip/catalog-filter-mobile2.js',
            1,
        )
    INDEX.write_text(html, encoding="utf-8")


def _load_regen_font_pages():
    """Load scripts/regen-font-pages.py (hyphenated module name)."""
    import importlib.util

    path = Path(__file__).resolve().parent / "regen-font-pages.py"
    spec = importlib.util.spec_from_file_location("regen_font_pages", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def detail_html(font: dict, names: dict[str, str] | None = None) -> str:
    # SEO + Variant 2 markup lives in scripts/regen-font-pages.py
    regen = _load_regen_font_pages()
    name_map = names or {font["slug"]: font["name"]}
    return regen.detail_html(font, name_map)


def write_font_pages(fonts: list[dict]) -> None:
    # Do not rmtree FONT_DIR — only rewrite index.html (preserves any extras).
    regen = _load_regen_font_pages()
    names = {font["slug"]: font["name"] for font in fonts}
    for font in fonts:
        path = FONT_DIR / font["slug"] / "index.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(regen.detail_html(font, names), encoding="utf-8")
    regen.write_sitemap(fonts)
    print(f"wrote {len(fonts)} font pages")


def write_stories_page() -> None:
    html = INDEX.read_text(encoding="utf-8")
    html = html.replace("<html lang=\"kk\">", "<html lang=\"kk\" class=\"qarip-stories\">", 1)
    html = html.replace(
        "<title>Qarip — қазақша қаріптер</title>",
        "<title>Қазақша Stories мәтін генераторы | Qarip</title>",
        1,
    )
    html = html.replace(
        'content="Қазақ тілін қолдайтын қаріптерді қарап, тексеріп, ресми дереккөзден жүктеңіз."',
        'content="Қазақша Stories үшін қаріп комбинациясын таңдаңыз, мәтінді өңдеңіз және дайын 9:16 PNG жүктеп алыңыз."',
        1,
    )
    if 'rel="canonical"' in html:
        html = re.sub(
            r'<link rel="canonical" href="[^"]*"/>',
            '<link rel="canonical" href="https://aqsuek.kz/qarip/stories/"/>',
            html,
            count=1,
        )
    else:
        html = html.replace(
            "</title>",
            '</title><link rel="canonical" href="https://aqsuek.kz/qarip/stories/"/>',
            1,
        )
    STORIES.parent.mkdir(parents=True, exist_ok=True)
    STORIES.write_text(html, encoding="utf-8")
    print("wrote /qarip/stories/")


def write_reels_redirect() -> None:
    REELS.parent.mkdir(parents=True, exist_ok=True)
    REELS.write_text(
        '<!DOCTYPE html><html lang="kk"><head><meta charset="utf-8"/>'
        '<meta http-equiv="refresh" content="0;url=/qarip/stories/"/>'
        '<link rel="canonical" href="https://aqsuek.kz/qarip/stories/"/>'
        "<title>Stories</title></head><body>"
        '<script>location.replace("/qarip/stories/");</script>'
        '<a href="/qarip/stories/">Stories</a></body></html>\n',
        encoding="utf-8",
    )
    print("wrote /qarip/reels/ redirect")


def main() -> None:
    SITE.joinpath("data").mkdir(parents=True, exist_ok=True)
    fonts = parse_fonts()
    DATA.write_text(json.dumps(fonts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"fonts.json {len(fonts)}")
    strip_font_face()
    patch_unique_strings()
    write_font_pages(fonts)
    write_stories_page()
    write_reels_redirect()


if __name__ == "__main__":
    main()
