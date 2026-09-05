(() => {
  const KZ_PAIRS = [
    ["Ә", "ә"],
    ["Ғ", "ғ"],
    ["Қ", "қ"],
    ["Ң", "ң"],
    ["Ө", "ө"],
    ["Ұ", "ұ"],
    ["Ү", "ү"],
    ["Һ", "һ"],
    ["І", "і"],
  ];
  const KZ_GLYPHS = KZ_PAIRS.flat();
  const PREVIEW_TEXT =
    "Қазақ тілі — ғажап тіл. Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І";
  const GENERIC_AUTHORS = new Set([
    "жеке жинақ",
    "жеке жинақ · архив",
    "жеке жинак",
    "жеке жинақ. архив",
  ]);
  const LICENSE = {
    open: {
      key: "open",
      badge: "Open Source",
      title: "Ашық лицензия. Жеке және коммерциялық жобаларда қолдануға болады.",
      warn: false,
    },
    commercial: {
      key: "commercial",
      badge: "Commercial use",
      title: "Коммерциялық қолдануға рұқсат етілген.",
      warn: false,
    },
    personal: {
      key: "personal",
      badge: "Personal use",
      title: "Жеке қолдануға арналған. Коммерциялық жобада қолданбас бұрын лицензиясын тексеріңіз.",
      warn: true,
    },
    check: {
      key: "check",
      badge: "Лицензияны тексеріңіз",
      title: "Лицензия туралы толық ақпарат расталмаған. Коммерциялық қолданбас бұрын құқық иесінің шарттарын тексеріңіз.",
      warn: true,
    },
  };

  function cleanText(value) {
    if (value == null) return "";
    if (typeof value === "number" && !Number.isFinite(value)) return "";
    const text = String(value).trim();
    if (!text) return "";
    if (/^(nan|undefined|null)$/i.test(text)) return "";
    return text;
  }

  function displayAuthor(maker) {
    const text = cleanText(maker);
    if (!text) return "";
    if (GENERIC_AUTHORS.has(text.toLowerCase())) return "";
    return text.replace(/\s*·\s*архив$/i, "").trim();
  }

  function licenseInfo(key) {
    return LICENSE[key] || LICENSE.check;
  }

  function measureGlyph(ctx, ch, tofu) {
    const width = ctx.measureText(ch).width;
    if (width <= 0) return false;
    return tofu.every((t) => Math.abs(width - t) >= 0.6);
  }

  function kazakhGlyphReport(family) {
    const fontFamily = cleanText(family).replace(/^["']|["']$/g, "");
    if (!fontFamily) {
      return { status: "none", missing: KZ_GLYPHS.slice(), loaded: false };
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { status: "none", missing: KZ_GLYPHS.slice(), loaded: false };
    }
    ctx.font = `72px "${fontFamily}"`;
    const tofu = [ctx.measureText("\uFFFF").width, ctx.measureText("\uFFFE").width];
    const missing = [];
    KZ_GLYPHS.forEach((ch) => {
      if (!measureGlyph(ctx, ch, tofu)) missing.push(ch);
    });
    if (missing.length === 0) return { status: "full", missing, loaded: true };
    if (missing.length >= KZ_GLYPHS.length) return { status: "none", missing, loaded: true };
    return { status: "some", missing, loaded: true };
  }

  function glyphLabel(report) {
    if (!report || report.status === "wait") return "";
    if (report.status === "full") return "Толық қолдау";
    if (report.status === "none") return "Қолдау жоқ";
    const miss = (report.missing || []).join(" ");
    return miss ? `Жартылай қолдау · жоқ ${miss}` : "Жартылай қолдау";
  }

  function savedNames() {
    try {
      const raw = JSON.parse(localStorage.getItem("qarip-favorites") || "[]");
      return new Set((Array.isArray(raw) ? raw : []).map(cleanText).filter(Boolean));
    } catch {
      return new Set();
    }
  }

  function toggleFavorite(name) {
    const next = savedNames();
    const key = cleanText(name);
    if (!key) return next;
    if (next.has(key)) next.delete(key);
    else next.add(key);
    localStorage.setItem("qarip-favorites", JSON.stringify([...next]));
    return next;
  }

  const loadedFamilies = new Set();

  async function loadFamily(family, url) {
    const fam = cleanText(family).replace(/^["']|["']$/g, "");
    const src = cleanText(url);
    if (!fam || !src) return false;
    if (loadedFamilies.has(fam)) return true;
    if ([...document.fonts].some((face) => face.family === fam)) {
      loadedFamilies.add(fam);
      return true;
    }
    try {
      const face = new FontFace(fam, `url("${src}")`);
      await face.load();
      document.fonts.add(face);
      loadedFamilies.add(fam);
      return true;
    } catch {
      return false;
    }
  }

  function ensureModal() {
    let modal = document.querySelector(".qarip-license-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "qarip-license-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="qarip-license-dialog" role="dialog" aria-modal="true" aria-labelledby="qarip-dl-title">
        <h2 id="qarip-dl-title">Қаріпті жүктеу</h2>
        <p>Бұл қаріптің лицензия шарттары толық расталмаған.</p>
        <p>Коммерциялық жобаға қолданбас бұрын автордың немесе құқық иесінің лицензия шарттарын тексеруді ұсынамыз.</p>
        <div class="qarip-license-actions">
          <button type="button" class="qarip-dl-go">Жүктеу</button>
          <a class="qarip-dl-info" href="/qarip/#about">Лицензия туралы ақпарат</a>
        </div>
        <button type="button" class="qarip-dl-close" aria-label="Жабу">×</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) hideModal();
    });
    modal.querySelector(".qarip-dl-close").addEventListener("click", hideModal);
    modal.querySelector(".qarip-dl-go").addEventListener("click", () => {
      const href = modal.dataset.href;
      const filename = modal.dataset.filename || "";
      hideModal();
      if (href) startDownload(href, filename);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) hideModal();
    });
    return modal;
  }

  function hideModal() {
    const modal = document.querySelector(".qarip-license-modal");
    if (modal) modal.hidden = true;
  }

  function startDownload(href, filename) {
    const link = document.createElement("a");
    link.href = href;
    if (filename) link.download = filename;
    else link.setAttribute("download", "");
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showDownloadWarning(href, filename) {
    const modal = ensureModal();
    modal.dataset.href = href;
    modal.dataset.filename = filename || "";
    modal.hidden = false;
    modal.querySelector(".qarip-dl-go")?.focus();
  }

  function handleDownloadClick(event, licenseKey, href, filename) {
    const info = licenseInfo(licenseKey);
    if (!info.warn) return false;
    event.preventDefault();
    event.stopPropagation();
    showDownloadWarning(href, filename);
    return true;
  }

  window.Qarip = {
    KZ_GLYPHS,
    PREVIEW_TEXT,
    LICENSE,
    cleanText,
    displayAuthor,
    licenseInfo,
    kazakhGlyphReport,
    glyphLabel,
    savedNames,
    toggleFavorite,
    loadFamily,
    startDownload,
    showDownloadWarning,
    handleDownloadClick,
    ensureModal,
  };
})();
