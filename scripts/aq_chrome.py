"""Shared page chrome for aqsuek.kz: one header, phone tab bar, footer and backdrop.

Every generator (build-blog.py, build-landings.py, regen-font-pages.py) and
sync-chrome.py (for the hand-written pages) takes its markup from here, so a
menu change is made once. Styles live in /aq/glass.css, behaviour in /aq/glass.js.
"""
from html import escape

GLASS_V = "4"
BEACON = ('<script defer src="https://static.cloudflareinsights.com/beacon.min.js" '
          'data-cf-beacon=\'{"token": "4cff9e1227a64f6ea836c3fd64686153"}\'></script>')

TEXT = {
    "kk": {
        "home": "/", "blog": "/blog/", "nav": "Негізгі мәзір", "foot_nav": "Төменгі мәзір", "tabs": "Құралдар",
        "about": "Жоба туралы", "articles": "Мақалалар", "privacy": "Құпиялық", "home_tab": "Басты",
        "cta": "Қаріп табу", "lang_href": "/ru/", "lang_label": "РУС", "lang_code": "ru", "lang_aria": "Русская версия",
        "mail": "Ұсыныс пен қате туралы:", "copy": "Көшіру", "skip": "Негізгі мазмұнға өту",
    },
    "ru": {
        "home": "/ru/", "blog": "/ru/blog/", "nav": "Главное меню", "foot_nav": "Нижнее меню", "tabs": "Инструменты",
        "about": "О проекте", "articles": "Статьи", "privacy": "Конфиденциальность", "home_tab": "Главная",
        "cta": "Найти шрифт", "lang_href": "/", "lang_label": "ҚАЗ", "lang_code": "kk", "lang_aria": "Қазақша нұсқасы",
        "mail": "Предложения и ошибки:", "copy": "Скопировать", "skip": "Перейти к содержимому",
    },
}


def head_assets(extra_families: str = "") -> str:
    """Font and stylesheet links for <head>. extra_families: more '&family=…' query parts."""
    return (
        '<link rel="preconnect" href="https://fonts.googleapis.com"/>\n'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geologica:wght@500;700;800'
        f'&family=Onest:wght@400;500;600;700{extra_families}&display=swap"/>\n'
        f'<link rel="stylesheet" href="/aq/glass.css?v={GLASS_V}"/>\n'
        '<meta name="theme-color" content="#E9EEF4" media="(prefers-color-scheme: light)"/>\n'
        '<meta name="theme-color" content="#070C12" media="(prefers-color-scheme: dark)"/>\n'
    )


def backdrop(glyphs: str = "ҚӘҰ") -> str:
    spans = "".join(f"<span>{escape(g)}</span>" for g in glyphs[:3])
    return ('<div class="backdrop" aria-hidden="true">\n'
            '  <div class="field a"></div><div class="field b"></div><div class="field c"></div><div class="field d"></div>\n'
            f'  <div class="glyphs">{spans}</div>\n</div>\n')


def _items(lang):
    t = TEXT[lang]
    return [("qarip", "/qarip/", "Qarip"), ("tanba", "/tanba/stories/", "Таңба"), ("dauystap", "/dauystap/", "DauysTap"),
            ("blog", t["blog"], t["articles"]), ("about", "/about/", t["about"])]


def _cur(on: bool) -> str:
    return ' class="on" aria-current="page"' if on else ""


def header(lang: str = "kk", active: str = "", lang_href: str = "") -> str:
    t = TEXT[lang]
    links = "\n".join(f'        <a href="{h}"{_cur(k == active)}>{escape(n)}</a>' for k, h, n in _items(lang))
    return (f'<a class="skip glass" href="#main">{t["skip"]}</a>\n'
            '<header class="top">\n  <div class="wrap">\n    <div class="capsule glass">\n'
            f'      <a class="logo" href="{t["home"]}">AQSU<span>E</span>K</a>\n'
            f'      <nav aria-label="{t["nav"]}">\n{links}\n      </nav>\n'
            f'      <a class="lang" href="{lang_href or t["lang_href"]}" lang="{t["lang_code"]}" hreflang="{t["lang_code"]}" aria-label="{t["lang_aria"]}">{t["lang_label"]}</a>\n'
            f'      <a class="btn tinted glass sm" href="/qarip/">{t["cta"]}</a>\n'
            '    </div>\n  </div>\n</header>\n')


def tabbar(lang: str = "kk", active: str = "") -> str:
    t = TEXT[lang]
    tabs = [("home", t["home"], "А", t["home_tab"]), ("qarip", "/qarip/", "Ә", "Qarip"), ("tanba", "/tanba/stories/", "Т", "Таңба"),
            ("dauystap", "/dauystap/", "●", "DauysTap"), ("blog", t["blog"], "≡", t["articles"])]
    links = "\n".join(f'  <a href="{h}"{_cur(k == active)}><b>{g}</b>{escape(n)}</a>' for k, h, g, n in tabs)
    return f'<nav class="tabbar glass strong" aria-label="{t["tabs"]}">\n{links}\n</nav>\n'


def footer(lang: str = "kk", note: str = "") -> str:
    t = TEXT[lang]
    links = "".join(f'<a href="{h}">{escape(n)}</a>' for _, h, n in _items(lang)) + f'<a href="/privacy/">{t["privacy"]}</a>'
    note_html = f'\n        <p class="note">{note}</p>' if note else ""
    return ('<footer>\n  <div class="wrap">\n    <div class="foot glass">\n      <div class="foot-id">\n'
            f'        <a class="logo" href="{t["home"]}">AQSU<span>E</span>K</a>\n'
            f'        <div class="mail">{t["mail"]} <code>ekunat00@gmail.com</code>'
            f'<button class="copy glass strong" type="button">{t["copy"]}</button></div>{note_html}\n'
            f'      </div>\n      <nav aria-label="{t["foot_nav"]}">{links}</nav>\n'
            '    </div>\n  </div>\n</footer>\n')


def scripts() -> str:
    return f'<script src="/aq/glass.js?v={GLASS_V}"></script>\n{BEACON}\n'
