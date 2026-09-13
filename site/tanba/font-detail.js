(() => {
  const Q = window.Qarip;
  if (!Q) return;
  const root = document.querySelector(".font-detail");
  if (!root) return;

  const name = root.dataset.name || document.querySelector("h1")?.textContent || "";
  const family = root.dataset.family || "";
  const previewUrl = root.dataset.preview || "";
  const download = root.dataset.download || "";
  const licenseKey = root.dataset.license || "check";
  const input = root.querySelector(".detail-preview-input");
  const size = root.querySelector(".detail-size");
  const preview = root.querySelector(".font-detail-preview");
  const letters = root.querySelector(".font-detail-letters");
  const glyphLive = root.querySelector(".glyph-live");
  const badge = root.querySelector(".license-badge");
  const copy = root.querySelector(".license-copy");
  const fav = root.querySelector(".font-favorite");
  const dl = root.querySelector(".font-download");
  const author = root.querySelector(".font-detail-author");
  const info = Q.licenseInfo(licenseKey);

  if (badge) badge.textContent = info.badge || "Лицензияны тексеріңіз";
  if (copy) copy.textContent = info.title;

  // Prefer Tanba path in status bar / copy-link; CDN is resolved only in startDownload.
  if (dl && download && download.startsWith("/tanba/downloads/")) {
    dl.setAttribute("href", download);
  }

  if (author) {
    const raw = (author.textContent || "").trim();
    const shown = Q.displayAuthor(raw.replace(/^Автор\s*/i, ""));
    if (!shown || /көрсетілмеген/i.test(raw)) {
      author.hidden = true;
      author.textContent = "";
    } else {
      author.hidden = false;
      author.textContent = `Автор · ${shown}`;
    }
  }

  function paintFav() {
    if (!fav || !name) return;
    const on = Q.savedNames().has(name);
    fav.setAttribute("aria-pressed", String(on));
    fav.textContent = on ? "♥" : "♡";
  }

  function paintPreview() {
    const text = (input?.value || "").trim() || Q.PREVIEW_TEXT;
    const px = Number(size?.value) || 40;
    if (preview) {
      preview.textContent = text;
      preview.style.fontFamily = `"${family}"`;
      preview.style.fontSize = `${px}px`;
    }
    if (letters) letters.style.fontFamily = `"${family}"`;
    const strong = root.querySelector(".size-control strong");
    if (strong) strong.textContent = `${px}px`;
  }

  function paintGlyphs() {
    const report = Q.kazakhGlyphReport(`"${family}"`);
    if (!glyphLive) return;
    if (report.status === "full") glyphLive.textContent = "Қазақ әліпбиі: Толық қолдау";
    else if (report.status === "none") glyphLive.textContent = `Қазақ әліпбиі: Қолдау жоқ · жоқ ${report.missing.join(" ")}`;
    else glyphLive.textContent = `Қазақ әліпбиі: Жартылай қолдау · жоқ ${report.missing.join(" ")}`;
  }

  fav?.addEventListener("click", (event) => {
    event.preventDefault();
    Q.toggleFavorite(name);
    paintFav();
  });

  const toggle = document.querySelector(".qarip-nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = document.documentElement.classList.toggle("qarip-nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  dl?.addEventListener("click", (event) => {
    const href = download || dl.getAttribute("href") || "";
    const filename = (href.split("/").pop() || "").split("?")[0];
    if (Q.handleDownloadClick(event, licenseKey, href, filename)) return;
    if (href && /\/tanba\/downloads\//i.test(href)) {
      event.preventDefault();
      Q.startDownload(href, filename);
    }
  });

  input?.addEventListener("input", paintPreview);
  size?.addEventListener("input", paintPreview);
  document.querySelectorAll('a[href="/tanba/stories/"]').forEach((link) => {
    link.href = `/tanba/stories/?font=${encodeURIComponent(name)}`;
  });
  paintFav();
  paintPreview();
  Q.loadFamily(family, previewUrl).finally(paintGlyphs);
})();
