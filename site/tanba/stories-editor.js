(() => {
  if (!/\/tanba\/(stories|reels)\/?$/.test(location.pathname)) return;
  if (window.__qaripStoriesLeto) return;
  window.__qaripStoriesLeto = 1;

  const STORE = "qarip-stories-editor-v2";
  const FAV_FONTS = "qarip-stories-font-favs";
  const FAV_PAIRS = "qarip-stories-combo-favs";
  const ONBOARD = "qarip-stories-onboard-v1";
  const ASSET_V = "tanba18";

  let FONT_DATA = null;
  let fontDataPromise = null;
  function loadFontData() {
    if (fontDataPromise) return fontDataPromise;
    fontDataPromise = fetch(`/qarip/data/fonts.json?v=${ASSET_V}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const rows = Array.isArray(list) ? list : [];
        const byName = new Map();
        rows.forEach((row) => {
          if (!row?.name) return;
          const prev = byName.get(row.name);
          if (!prev || (prev.source === "google" && row.source !== "google")) byName.set(row.name, row);
        });
        FONT_DATA = [...byName.values()];
        return FONT_DATA;
      })
      .catch(() => {
        FONT_DATA = [];
        return FONT_DATA;
      });
    return fontDataPromise;
  }

  const fontFaceCache = new Map();
  function ensureFontFace(family, url, descriptors = {}) {
    if (!family || !url || typeof FontFace === "undefined") return Promise.resolve(null);
    const weight = String(descriptors.weight || "400");
    const style = descriptors.style || "normal";
    const key = `${family}|${url}|${weight}|${style}`;
    if (fontFaceCache.has(key)) return fontFaceCache.get(key);
    const ext = (url.split(".").pop() || "").toLowerCase();
    const fmt = ext === "otf" ? "opentype" : ext === "woff2" ? "woff2" : ext === "woff" ? "woff" : "truetype";
    let face;
    try {
      face = new FontFace(family, `url("${url}") format("${fmt}")`, { weight, style });
    } catch {
      return Promise.resolve(null);
    }
    const p = face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        return loaded;
      })
      .catch(() => null);
    fontFaceCache.set(key, p);
    return p;
  }

  function loadPreviewFont(family, url) {
    const fam = decodeURIComponent(family || "");
    const src = url || "";
    if (src.startsWith("google:")) return ensureGoogleFont(src.slice(7) || fam);
    if (src) return ensureFontFace(fam, src);
    return Promise.resolve();
  }

  let fontCardObserver = null;
  function observeFontCards(container) {
    const run = (btn) => loadPreviewFont(btn.dataset.fontFamily || "", btn.dataset.fontUrl);
    if (typeof IntersectionObserver === "undefined") {
    qsa(".leto-font-grid button[data-font-url], .leto-weight-grid button[data-font-url]", container).forEach(run);
      return;
    }
    if (fontCardObserver) fontCardObserver.disconnect();
    fontCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          fontCardObserver.unobserve(entry.target);
        });
      },
      { root: container, rootMargin: "300px 0px" }
    );
    qsa(".leto-font-grid button[data-font-url], .leto-weight-grid button[data-font-url]", container).forEach((btn) => fontCardObserver.observe(btn));
  }

  function fontCategoryOf(styleText, categoryText) {
    const t = `${styleText || ""} ${categoryText || ""}`.toLowerCase();
    if (/сериф|serif/.test(t)) return "serif";
    if (/дисплей|display/.test(t)) return "display";
    if (/қолжазба|hand|script/.test(t)) return "script";
    if (/моно|mono/.test(t)) return "mono";
    return "sans";
  }

  const SOLID = ["#07102a", "#ffffff", "#0040dc", "#f06848", "#64b5ff", "#0f3d2e", "#7c3aed", "#1e293b", "#f97316", "#000000"];
  const STYLE_SWATCHES = ["#ffffff", "#000000", "#0040dc", "#f06848", "#d9ff47", "#64b5ff", "#7c3aed"];
  const GRADS = [
    { id: "night", label: "Түн", css: "linear-gradient(160deg,#0b1020,#1a1030 55%,#101014)" },
    { id: "warm", label: "Жылы", css: "linear-gradient(160deg,#3a2218,#8b5a2b 50%,#1a120e)" },
    { id: "rose", label: "Қызғылт", css: "linear-gradient(160deg,#4a1830,#d96b8a 55%,#2a1020)" },
    { id: "ocean", label: "Мұхит", css: "linear-gradient(160deg,#0b2a40,#1f6f8b 50%,#062018)" },
    { id: "mint", label: "Жасыл", css: "linear-gradient(160deg,#11332a,#4db6a0 55%,#0b1c18)" },
    { id: "paper", label: "Қағаз", css: "linear-gradient(180deg,#f7f6f2,#e8e2d6)" },
  ];
  const PHOTOS = [
    { id: "minimal", label: "Қарапайым", src: `/tanba/assets/story-bg/minimal.jpg?v=${ASSET_V}`, tags: ["эстетика"] },
    { id: "coffee", label: "Кофе", src: `/tanba/assets/story-bg/coffee.jpg?v=${ASSET_V}`, tags: ["эстетика"] },
    { id: "beauty", label: "Сұлулық", src: `/tanba/assets/story-bg/beauty.jpg?v=${ASSET_V}`, tags: ["гүл"] },
    { id: "travel", label: "Саяхат", src: `/tanba/assets/story-bg/travel.jpg?v=${ASSET_V}`, tags: ["жаз"] },
    { id: "lifestyle", label: "Күнделікті", src: `/tanba/assets/story-bg/lifestyle.jpg?v=${ASSET_V}`, tags: ["эстетика"] },
    { id: "nature", label: "Табиғат", src: `/tanba/assets/story-bg/nature.jpg?v=${ASSET_V}`, tags: ["жаз"] },
    { id: "business", label: "Іскерлік", src: `/tanba/assets/story-bg/business.jpg?v=${ASSET_V}`, tags: ["бренд"] },
  ];
  const PAIR_META = [
    { name: "Playfair × Montserrat", group: "Luxury", sampleA: "Balance", sampleB: "қазақша стиль" },
    { name: "Prata × Gilroy", group: "Luxury", sampleA: "Chic", sampleB: "editorial look" },
    { name: "Oswald × Onest", group: "Bold", sampleA: "BOLD", sampleB: "қысқа сөз" },
    { name: "Yeseva × Manrope", group: "Beauty", sampleA: "Stylish", sampleB: "soft & clean" },
    { name: "Cormorant × Gotham", group: "Minimal", sampleA: "Minimal", sampleB: "тыныш дизайн" },
    { name: "Rubik × Inter", group: "Business", sampleA: "WORK", sampleB: "business tone" },
    { name: "Forum × Oswald", group: "Travel", sampleA: "GO", sampleB: "travel mood" },
  ];
  const STICKERS = ["✨", "♡", "★", "🔥", "✦", "✿", "●", "▲", "■", "♪", "✧", "❖"];
  const LAYOUTS = {
    center: { hook: 42, mark: 58, extra: 72 },
    top: { hook: 22, mark: 34, extra: 46 },
    bottom: { hook: 58, mark: 70, extra: 82 },
    promo: { hook: 28, mark: 68, extra: 80 },
  };
  const LOGO_POS = {
    "top-left": { x: 14, y: 10 },
    "top-center": { x: 50, y: 10 },
    "top-right": { x: 86, y: 10 },
    center: { x: 50, y: 50 },
    "bottom-left": { x: 14, y: 88 },
    "bottom-center": { x: 50, y: 88 },
    "bottom-right": { x: 86, y: 88 },
  };

  const defaultState = () => ({
    bg: { type: "transparent", value: "", fit: "cover", posX: 50, posY: 50, x: 0, y: 0, scale: 1, rotate: 0 },
    logo: { src: "", pos: "top-right", size: 18, opacity: 100, margin: 8 },
    layout: "center",
    text: { size: 100, align: "center", lineHeight: 100, letterSpacing: 0, maxWidth: 86 },
    customGrad: { from: "#0b1020", to: "#ff4d8d", angle: 160 },
    stickers: [],
    lastPair: "",
    lastFontName: "",
  });

  let state = defaultState();
  try {
    state = { ...defaultState(), ...JSON.parse(localStorage.getItem(STORE) || "{}") };
    state.bg = { ...defaultState().bg, ...(state.bg || {}) };
    state.logo = { ...defaultState().logo, ...(state.logo || {}) };
    state.text = { ...defaultState().text, ...(state.text || {}) };
    state.customGrad = { ...defaultState().customGrad, ...(state.customGrad || {}) };
    if (!Array.isArray(state.stickers)) state.stickers = [];
  } catch {}

  let fontFavs = [];
  let pairFavs = [];
  try {
    fontFavs = JSON.parse(localStorage.getItem(FAV_FONTS) || "[]");
    pairFavs = JSON.parse(localStorage.getItem(FAV_PAIRS) || "[]");
  } catch {}

  const history = [];
  let histIdx = -1;
  let activeSheet = "";
  const colorPop = { on: false, mode: "text", h: 0, s: 1, v: 1 };
  let fontCat = "all";
  let fontQuery = "";
  let pairGroup = "all";
  let bgTab = "photos";
  let bgEdit = false;
  let fontWeightStep = null;
  function faceLabel(label) {
    return ({ Thin: "Өте жұқа", Light: "Жұқа", Regular: "Қалыпты", Medium: "Орташа", Semibold: "Жартылай қалың", Bold: "Қалың", Black: "Өте қалың", Italic: "Курсив" })[label] || label;
  }
  function faceIcon(f) {
    const italic = (f.style || "normal") === "italic" || /italic|курсив/i.test(`${f.id || ""} ${f.label || ""}`);
    const w = Number(f.weight || 400);
    if (italic) {
      return `<svg class="tb-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 4v3h2.21L8.79 15H6v3h8v-3h-2.21L15.21 7H18V4z"/></svg>`;
    }
    if (w >= 600) {
      return `<svg class="tb-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>`;
    }
    const stem = w <= 350 ? 2 : 2.6;
    const inset = (14 - stem) / 2;
    return `<svg class="tb-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h14v2.8h-${inset}V20h-${stem}V6.8H5z"/></svg>`;
  }
  function faceIconClass(f) {
    if ((f.style || "normal") === "italic") return "tb-italic";
    if (Number(f.weight || 400) >= 600) return "tb-bold";
    if (Number(f.weight || 400) <= 350) return "tb-thin";
    return "tb-regular";
  }
  const DEFAULT_FACES = [
    { id: "regular", label: "Қалыпты", weight: "400", style: "normal" },
    { id: "bold", label: "Қалың", weight: "700", style: "normal" },
    { id: "italic", label: "Курсив", weight: "400", style: "italic" },
  ];

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }
  function qsa(sel, root = document) {
    return [...root.querySelectorAll(sel)];
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
      localStorage.setItem(FAV_FONTS, JSON.stringify(fontFavs));
      localStorage.setItem(FAV_PAIRS, JSON.stringify(pairFavs));
      const badge = qs(".leto-saved");
      if (badge) {
        badge.classList.add("on");
        clearTimeout(save._t);
        save._t = setTimeout(() => badge.classList.remove("on"), 1400);
      }
    } catch {}
  }
  function pushHistory() {
    const snap = JSON.stringify(state);
    if (histIdx >= 0 && history[histIdx] === snap) return;
    history.splice(histIdx + 1);
    history.push(snap);
    if (history.length > 30) history.shift();
    histIdx = history.length - 1;
  }
  function restoreHistory(dir) {
    const next = histIdx + dir;
    if (next < 0 || next >= history.length) return;
    histIdx = next;
    try {
      state = { ...defaultState(), ...JSON.parse(history[histIdx]) };
      applyAll();
    } catch {}
  }

  function bindEditorKeys() {
    if (document.documentElement.dataset.letoKeys === "1") return;
    document.documentElement.dataset.letoKeys = "1";
    document.addEventListener("keydown", (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || String(e.key).toLowerCase() !== "z") return;
      const t = e.target;
      if (t instanceof Element && t.closest("input,textarea,[contenteditable='true']")) return;
      e.preventDefault();
      restoreHistory(e.shiftKey ? 1 : -1);
    });
  }

  function maybeOnboard() {
    try {
      if (localStorage.getItem(ONBOARD) === "1") return;
    } catch {}
    if (qs(".leto-hint-card")) return;
    const card = document.createElement("div");
    card.className = "leto-hint-card";
    card.innerHTML = `<span>Алдымен фон таңдаңыз — төменде «Фон».</span><button type="button">Түсінікті</button>`;
    document.body.append(card);
    let step = 0;
    card.querySelector("button")?.addEventListener("click", () => {
      step += 1;
      if (step === 1) {
        card.querySelector("span").textContent = "Енді мәтін қосыңыз.";
        return;
      }
      try { localStorage.setItem(ONBOARD, "1"); } catch {}
      card.remove();
    });
  }

  function ensureStyleLink() {
    if (qs("link[data-stories-editor-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/tanba/stories-editor.css?v=${ASSET_V}`;
    link.dataset.storiesEditorCss = "1";
    document.head.appendChild(link);
  }

  function icon(svg) {
    return svg;
  }
  const ICO = {
    back: "",
    undo: "",
    redo: "",
    more: "",
    export: "",
    layers: "",
  };

  function ensureShell() {
    const pick = qs(".reels-pick");
    const preview = qs(".phone-preview");
    const controls = qs(".reels-controls");
    if (!pick || !preview) return null;
    if (pick.dataset.leto === "1") {
      return {
        pick,
        preview,
        controls,
        app: qs(".leto-app"),
        stage: qs(".leto-stage"),
      };
    }
    pick.dataset.leto = "1";

    const app = document.createElement("div");
    app.className = "leto-app";
    app.innerHTML = `
      <div class="leto-topbar">
        <button type="button" class="leto-icon" data-acto="back" aria-label="Артқа">${ICO.back}</button>
        <div class="leto-top-center">
          <button type="button" class="leto-icon" data-acto="undo" aria-label="Болдырмау">${ICO.undo}</button>
          <button type="button" class="leto-icon" data-acto="redo" aria-label="Қайталау">${ICO.redo}</button>
        </div>
        <button type="button" class="leto-export" data-acto="export" aria-label="Жүктеу">Жүктеу</button>
        <span class="leto-saved">Сақталды</span>
      </div>
      <div class="leto-stage"></div>
    `;

    const editor = document.createElement("div");
    editor.className = "stories-editor";
    const previewCol = document.createElement("div");
    previewCol.className = "stories-editor-preview";
    const panelCol = document.createElement("div");
    panelCol.className = "stories-editor-panel";

    preview.parentNode.insertBefore(app, preview);
    const stage = app.querySelector(".leto-stage");
    stage.append(editor);
    previewCol.append(preview);
    editor.append(previewCol, panelCol);
    if (controls) panelCol.append(controls);

    // dock
    const dock = document.createElement("div");
    dock.className = "leto-dock";
    dock.innerHTML = `
      <button type="button" class="leto-dock-btn leto-dock-add" data-acto="text" aria-label="Мәтін қосу">Мәтін</button>
      <button type="button" class="leto-dock-btn" data-acto="bg">Фон</button>
      <button type="button" class="leto-dock-btn" data-acto="gallery">Фото</button>
      <button type="button" class="leto-dock-btn" data-acto="grad">Градиент</button>
    `;
    document.body.append(dock);

    // text bar
    const textbar = document.createElement("div");
    textbar.className = "leto-textbar";
    textbar.innerHTML = `
      <button type="button" data-text-tool="font" class="tb-font">Қаріп</button>
      <button type="button" data-text-tool="style" class="tb-style">Стиль</button>
    `;
    document.body.append(textbar);

    // scrim + sheets container
    const scrim = document.createElement("div");
    scrim.className = "leto-scrim";
    scrim.dataset.acto = "close";
    document.body.append(scrim);

    ["add", "text", "fonts", "pairs", "bg", "stickers", "gallery", "layers", "grad", "style", "layout", "help"].forEach((id) => {
      const sheet = document.createElement("div");
      sheet.className = "leto-sheet";
      sheet.dataset.sheet = id;
      sheet.setAttribute("aria-hidden", "true");
      if ("inert" in sheet) sheet.inert = true;
      sheet.innerHTML = `
        <div class="leto-handle"></div>
        <div class="leto-sheet-head">
          <h3></h3>
          <button type="button" data-acto="close" aria-label="Жабу" tabindex="-1"></button>
        </div>
        <div class="leto-sheet-body"></div>
      `;
      document.body.append(sheet);
    });

    bindChrome(app, dock, textbar, scrim);
    document.querySelector(".reels-font-pick")?.remove();
    syncSheetA11y();
    return { pick, preview, controls, app, stage };
  }

  function sheetEl(id) {
    return qs(`.leto-sheet[data-sheet="${id}"]`);
  }

  function syncSheetA11y() {
    qsa(".leto-sheet").forEach((el) => {
      const on = el.classList.contains("on");
      el.setAttribute("aria-hidden", on ? "false" : "true");
      if ("inert" in el) el.inert = !on;
      el.querySelectorAll("button, input, textarea, select, a").forEach((node) => {
        if (on) node.removeAttribute("tabindex");
        else node.setAttribute("tabindex", "-1");
      });
    });
  }

  function openSheet(id) {
    activeSheet = id;
    qs(".leto-scrim")?.classList.add("on", "pass-stage");
    qsa(".leto-sheet").forEach((el) => el.classList.toggle("on", el.dataset.sheet === id));
    syncSheetA11y();
    renderSheet(id);
    syncDock(["bg", "gallery", "grad", "text"].includes(id) ? id : "");
    if (id === "bg") setBgEdit(hasBgPhoto());
    else if (id === "text" || id === "fonts" || id === "style" || id === "pairs" || id === "grad") setBgEdit(false);
    if (id === "fonts") {
      loadFontData().then(() => {
        if (activeSheet === "fonts") renderSheet("fonts");
      });
    }
  }
  function closeSheets() {
    activeSheet = "";
    qs(".leto-scrim")?.classList.remove("on", "pass-stage");
    qsa(".leto-sheet").forEach((el) => el.classList.remove("on"));
    syncSheetA11y();
    unmountTextInputs();
    syncDock("");
    closeColorPop(false);
  }

  function bindChrome(app, dock, textbar) {
    bindColorPop();
    const onAct = (e) => {
      const btn = e.target.closest("[data-acto]");
      if (!btn) return;
      const act = btn.dataset.acto;
      if (act === "back") {
        if (leaveModeToChoice()) return;
        location.href = "/tanba/";
        return;
      }
      if (act === "undo") restoreHistory(-1);
      if (act === "redo") restoreHistory(1);
      if (act === "export") {
        if (quickMode) copyStickerNative();
        else exportPng({ transparent: state.bg.type === "transparent" });
      }
      if (act === "text") {
        setBgEdit(false);
        closeSheets();
        const added = window.__qaripGesture?.addTextLayer?.();
        if (!added) qs(".text-add-btn")?.click();
        showTextbar();
        syncDock("");
        pushHistory();
        save();
      }
      if (act === "fonts") {
        setBgEdit(false);
        fontWeightStep = null;
        openSheet("fonts");
        syncDock("");
      }
      if (act === "bg") openSheet("bg");
      if (act === "gallery") openSheet("gallery");
      if (act === "grad") openSheet("grad");
      if (act === "help") openSheet("help");
      if (act === "close") closeSheets();
    };
    app.addEventListener("click", onAct);
    dock.addEventListener("click", onAct);
    qs(".leto-scrim")?.addEventListener("click", onAct);
    qsa(".leto-sheet").forEach((s) => s.addEventListener("click", onAct));

    textbar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-text-tool]");
      if (!btn) return;
      const t = btn.dataset.textTool;
      if (t.startsWith("align-")) {
        state.text.align = t.replace("align-", "");
        textbar.querySelectorAll("[data-text-tool^=align-]").forEach((b) => b.classList.toggle("active", b === btn));
      }
      if (t.startsWith("face-")) {
        applyFace(t.replace("face-", ""));
        return;
      }
      if (t === "style") {
        openSheet("style");
        return;
      }
      if (t === "font") {
        fontWeightStep = null;
        openSheet("fonts");
        return;
      }
      pushHistory();
      save();
      applyLayout();
    });

    document.addEventListener(
      "pointerdown",
      (e) => {
        if (e.target.closest(".sub-hook, .sub-mark, .sub-extra")) {
          setBgEdit(false);
          clearLogoSelect();
          showTextbar();
          return;
        }
        if (e.target.closest(".stories-logo, .leto-sticker, .stories-bg-hit, .stories-scale-handle")) {
          textbar.classList.remove("on");
          return;
        }
        if (e.target.closest(".leto-textbar, .leto-sheet, .leto-dock")) return;
        if (qs(".subtitle-stack [data-selected='1']")) return;
        textbar.classList.remove("on");
      },
      true
    );
    qs(".leto-stage")?.addEventListener("pointerdown", (e) => {
      if (!activeSheet) return;
      if (e.target.closest(".phone-preview")) return;
      closeSheets();
    });

    const stack = qs(".subtitle-stack");
    if (stack && stack.dataset.faceObserve !== "1") {
      stack.dataset.faceObserve = "1";
      new MutationObserver(() => {
        if (stack.querySelector("[data-selected='1']")) showTextbar();
        else if (!activeSheet) textbar.classList.remove("on");
      }).observe(stack, { subtree: true, attributes: true, attributeFilter: ["data-selected"] });
    }
  }

  function renderSheet(id) {
    const sheet = sheetEl(id);
    if (!sheet) return;
    const title = sheet.querySelector("h3");
    const body = sheet.querySelector(".leto-sheet-body");
    const titles = {
      add: "Қосу",
      text: "Мәтін",
      fonts: "Қаріп",
      pairs: "Қаріп жұптары",
      bg: "Фон",
      stickers: "Стикерлер",
      gallery: "Фото / логотип",
      layers: "Қабаттар",
      grad: "Градиент",
      style: "Стиль",
      layout: "Макет",
      help: "Көмек",
    };
    title.textContent = titles[id] || "";
    // Detach live text <input> nodes before any body.innerHTML swap so we never lose them.
    unmountTextInputs();
    if (id === "add") body.innerHTML = renderAddMenu();
    if (id === "text") body.innerHTML = renderTextSheet();
    if (id === "fonts") body.innerHTML = renderFonts();
    if (id === "pairs") body.innerHTML = renderPairs();
    if (id === "bg") body.innerHTML = renderBg();
    if (id === "stickers") body.innerHTML = renderStickers();
    if (id === "gallery") body.innerHTML = renderGallery();
    if (id === "layers") body.innerHTML = renderLayers();
    if (id === "grad") body.innerHTML = renderGrad();
    if (id === "help") body.innerHTML = renderHelp();
    if (id === "style") body.innerHTML = renderStyleSheet();
    if (id === "layout") body.innerHTML = renderLayoutSheet();
    if (id === "text") mountTextInputs(body);
    if (id === "fonts") observeFontCards(body);
    bindSheetBody(id, body);
  }

  function renderAddMenu() {
    const items = [
      { id: "text", ico: "Aa", label: "Мәтін қосу" },
      { id: "fonts", ico: "Ff", label: "Шрифттер" },
      { id: "pairs", ico: "&", label: "Қаріп жұптары" },
      { id: "bg", ico: "⛰", label: "Фон" },
      { id: "stickers", ico: "✦", label: "Стикерлер" },
      { id: "gallery", ico: "❀", label: "Лого/сурет" },
      { id: "layout", ico: "▦", label: "Макет" },
    ];
    return `<div class="leto-add-grid">${items
      .map((it) => `<button type="button" data-add="${it.id}"><div class="ico">${it.ico}</div><small>${it.label}</small></button>`)
      .join("")}</div>`;
  }

  function renderLayoutSheet() {
    const items = [
      { id: "top", label: "Жоғарыда", desc: "Мәтін жоғарғы бөлікте" },
      { id: "center", label: "Ортада", desc: "Классикалық орталық композиция" },
      { id: "bottom", label: "Төменде", desc: "Мәтін төменгі бөлікте" },
      { id: "promo", label: "Промо", desc: "Акцент жоғарыда, ақпарат төменде" },
    ];
    return `
      <p class="leto-hint">Мәтін блоктарының тік орналасуын таңда — canvas-та бірден өзгереді.</p>
      <div class="leto-layout-grid">
        ${items
          .map((it) => {
            const pos = LAYOUTS[it.id];
            const active = state.layout === it.id;
            return `<button type="button" data-layout="${it.id}" class="${active ? "active" : ""}">
              <div class="lo-frame">
                <span class="lo-line" style="top:${pos.hook}%"></span>
                <span class="lo-line" style="top:${pos.mark}%"></span>
                <span class="lo-line lo-sm" style="top:${pos.extra}%"></span>
              </div>
              <b>${it.label}</b>
              <small>${it.desc}</small>
            </button>`;
          })
          .join("")}
      </div>
    `;
  }

  function catalogFonts() {
    if (FONT_DATA && FONT_DATA.length) {
      return FONT_DATA.filter((f) => f.name && f.family && f.preview).map((f) => ({
        name: f.name,
        family: f.family,
        cat: fontCategoryOf(f.style, f.category),
        url: f.preview,
        faces: Array.isArray(f.faces) ? f.faces : [],
      }));
    }
    const seen = new Set();
    const fonts = [];
    qsa(".font-card").forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.trim();
      const preview = card.querySelector(".font-preview");
      const family = preview?.style.fontFamily || "";
      const style = (card.querySelector(".meta")?.textContent || "").toLowerCase();
      if (!name || !family || seen.has(name + family)) return;
      seen.add(name + family);
      const rec = (FONT_DATA || []).find((f) => f.name === name && (card.querySelector("a[href*='fonts.google.com']") ? f.source === "google" : f.source !== "google"));
      const fallback = (FONT_DATA || []).find((f) => f.name === name);
      const row = rec || fallback;
      const url = row?.preview || "";
      fonts.push({
        name,
        family,
        cat: fontCategoryOf(style, row?.category || ""),
        url,
        faces: Array.isArray(row?.faces) ? row.faces : [],
      });
    });
    // fallback from pair families if catalog hidden empty
    if (!fonts.length) {
      PAIR_META.forEach((p) => {
        fonts.push({ name: p.name.split(" × ")[0], family: `"${p.name.split(" × ")[0]}"`, cat: "display" });
      });
    }
    return fonts;
  }

  function recByName(name) {
    return (
      (FONT_DATA || []).find((f) => f.name === name) ||
      catalogFonts().find((f) => f.name === name) ||
      null
    );
  }

  function facesOf(rec) {
    if (rec?.faces?.length) return rec.faces;
    return DEFAULT_FACES;
  }

  function recForSelected() {
    const gesture = window.__qaripGesture?.getSelectedLayer?.();
    if (gesture?.fontName) {
      const byName = recByName(gesture.fontName);
      if (byName) return byName;
    }
    if (gesture?.family) {
      const famFromState = String(gesture.family)
        .replace(/["']/g, "")
        .split(",")[0]
        .trim();
      const byStateFam = famFromState
        ? (FONT_DATA || []).find((f) => String(f.family || "").replace(/["']/g, "") === famFromState)
        : null;
      if (byStateFam) return byStateFam;
    }
    const { el } = selectedLayerInfo();
    const fam = String(el ? el.style.fontFamily || getComputedStyle(el).fontFamily : "")
      .replace(/["']/g, "")
      .split(",")[0]
      .trim();
    const byFam = fam
      ? (FONT_DATA || []).find((f) => String(f.family || "").replace(/["']/g, "") === fam)
      : null;
    return byFam || recByName(state.lastFontName || "");
  }

  function loadFontFaces(rec) {
    if (!rec) return Promise.resolve();
    const fam = String(rec.family || "").replace(/["']/g, "").split(",")[0].trim();
    const src = rec.preview || "";
    if (src.startsWith("google:") || rec.source === "google") {
      return ensureGoogleFont(src.startsWith("google:") ? src.slice(7) || fam : fam);
    }
    const faces = rec.faces?.length ? rec.faces : src ? [{ url: src, weight: "400", style: "normal" }] : [];
    return Promise.all(faces.filter((f) => f.url).map((f) => ensureFontFace(fam, f.url, { weight: f.weight, style: f.style || "normal" })));
  }

  function syncNativeFaceButtons(faces) {
    const row = qs(".text-color-tools .text-face-row");
    if (!row) return;
    row.innerHTML = `<span>СТИЛЬ</span>${faces
      .map((f) => `<button type="button" data-face="${escapeAttr(f.id)}">${escapeHtml(faceLabel(f.label))}</button>`)
      .join("")}`;
  }

  function paintFaceGroup() {
    const rec = recForSelected();
    const custom = rec?.faces?.length > 1;
    const faces = custom ? rec.faces : DEFAULT_FACES;
    syncNativeFaceButtons(faces);
    window.__qaripGesture?.syncFace?.();
    syncTextbarFace();
  }

  function renderFonts() {
    if (fontWeightStep) {
      const rec = fontWeightStep;
      const fam = String(rec.family || "").replace(/["']/g, "").split(",")[0].trim();
      const cuts = rec.faces?.length ? rec.faces : [];
      return `
        <button type="button" class="leto-weight-back" data-font-weight-back>Қаріптер</button>
        <p class="leto-style-tag"><b>${escapeHtml(rec.name)}</b> — қалыңдығын басыңыз</p>
        <div class="leto-weight-grid">
          ${cuts
            .map((f) => {
              const url = f.url || rec.preview || "";
              return `<button type="button" data-font-cut="${escapeAttr(f.id)}" data-font-name="${escapeAttr(rec.name)}" data-font-family="${encodeURIComponent(rec.family)}" ${url ? `data-font-url="${escapeAttr(url)}"` : ""}>
                <span class="wc-glyph" style="font-family:'${escapeAttr(fam)}';font-weight:${escapeAttr(String(f.weight || 400))};font-style:${escapeAttr(f.style || "normal")}">Әә</span>
                <b>${escapeHtml(faceLabel(f.label))}</b>
              </button>`;
            })
            .join("")}
        </div>
      `;
    }
    let fonts = catalogFonts();
    if (!FONT_DATA) {
      loadFontData().then(() => {
        if (activeSheet === "fonts") renderSheet("fonts");
      });
      return `
      <p class="leto-style-tag">Қаріпті басыңыз. Қалыңдығы бар қаріпті ашып, нұсқасын таңдаңыз.</p>
      <p class="leto-hint">Қаріптер жүктелуде…</p>
    `;
    }
    if (fontQuery) {
      const q = fontQuery.toLowerCase();
      fonts = fonts.filter((f) => f.name.toLowerCase().includes(q));
    }
    return `
      <p class="leto-style-tag">Қаріпті басыңыз. Қалыңдығы бар қаріпті ашып, нұсқасын таңдаңыз.</p>
      <input class="leto-search" data-font-search type="search" placeholder="Қаріп атауын іздеу..." value="${fontQuery.replace(/"/g, "&quot;")}">
      <div class="leto-font-grid">
        ${fonts
          .slice(0, 80)
          .map((f) => {
            const cuts = f.faces?.length || 0;
            return `<button type="button" data-font-name="${escapeAttr(f.name)}" data-font-family="${encodeURIComponent(f.family)}" ${f.url ? `data-font-url="${escapeAttr(f.url)}"` : ""} ${cuts > 1 ? `data-font-cuts="${cuts}"` : ""}>
              <span class="fc-glyph" style="font-family:'${escapeAttr(String(f.family || "").replace(/["']/g, ""))}'">Aa</span>
              <b style="font-family:'${escapeAttr(String(f.family || "").replace(/["']/g, ""))}'">${escapeHtml(f.name)}</b>
              ${cuts > 1 ? `<small class="fc-cuts">${cuts} нұсқа</small>` : ""}
            </button>`;
          })
          .join("") || '<p class="leto-hint">Бұл атаумен қаріп табылмады.</p>'}
      </div>
    `;
  }

  function renderPairs() {
    const groups = ["all", "Minimal", "Bold", "Luxury", "Beauty", "Business", "Travel", "fav"];
    let list = PAIR_META.slice();
    if (pairGroup === "fav") list = list.filter((p) => pairFavs.includes(p.name));
    else if (pairGroup !== "all") list = list.filter((p) => p.group === pairGroup);
    // get live font families from existing buttons if possible
    const live = qsa(".reels-options:not(.reels-colors) > button");
    return `
      <div class="leto-chips">
        ${groups
          .map((g) => `<button type="button" data-pair-group="${g}" class="${pairGroup === g ? "active" : ""}">${g === "all" ? "Барлығы" : g === "fav" ? "Ұнағандар" : g}</button>`)
          .join("")}
      </div>
      <div class="leto-pair-grid">
        ${list
          .map((p) => {
            const btn = live.find((b) => (b.textContent || "").includes(p.name.split(" × ")[0]));
            const aStyle = btn?.querySelector("i")?.getAttribute("style") || "";
            const bStyle = btn?.querySelector("em")?.getAttribute("style") || "";
            const on = pairFavs.includes(p.name);
            return `<button type="button" data-pair="${escapeAttr(p.name)}">
              <div class="pair-a" style="${aStyle}">${escapeHtml(p.sampleA)}</div>
              <div class="pair-b" style="${bStyle}">${escapeHtml(p.sampleB)}</div>
              <span class="heart ${on ? "on" : ""}" data-fav-pair="${escapeAttr(p.name)}"></span>
            </button>`;
          })
          .join("")}
        <button type="button" data-pair="random"><div class="pair-a">?</div><div class="pair-b">Кездейсоқ</div></button>
      </div>
    `;
  }

  function currentBgPhotoCard() {
    const isPhoto = state.bg.type === "photo" || state.bg.type === "upload";
    if (!isPhoto || !state.bg.value) return "";
    const label =
      state.bg.type === "upload"
        ? "Жүктелген фото"
        : PHOTOS.find((p) => p.src === state.bg.value)?.label || "Фон фотосы";
    return `
      <div class="leto-bg-current">
        <div class="leto-bg-thumb" style="background-image:url('${escapeAttr(state.bg.value)}')"></div>
        <div class="leto-bg-current-meta">
          <b>Қазіргі фон</b>
          <small>${escapeHtml(label)}</small>
        </div>
        <div class="leto-bg-current-actions">
          <button type="button" data-bg-reset>Қалпына</button>
          <button type="button" data-bg-clear>Фонды өшіру</button>
        </div>
      </div>`;
  }

  function renderBg() {
    const tabs = [
      ["photos", "Фото"],
      ["colors", "Түс"],
      ["upload", "Жүктеу"],
      ["clear", "Мөлдір"],
    ];
    const current = currentBgPhotoCard();
    let pane = "";
    if (bgTab === "colors") {
      pane = `<div class="leto-swatches">${SOLID.map((c) => `<button type="button" data-solid="${c}" style="background:${c}"></button>`).join("")}
        <label class="leto-file" style="width:100%;margin-top:8px">Өз түс<input type="color" data-solid-custom value="#101014"></label></div>`;
    } else if (bgTab === "photos") {
      pane = `<div class="leto-chips">
        <button type="button" data-photo-tag="all" class="active">Барлығы</button>
        <button type="button" data-photo-tag="жаз">Жаз</button>
        <button type="button" data-photo-tag="эстетика">Эстетика</button>
        <button type="button" data-photo-tag="бренд">Бренд</button>
      </div>
      <p class="leto-hint">Фотоны басыңыз. Сосын канваста жылжытып, үлкейтіп, бұрыңыз.</p>
      <div class="leto-photo-grid" data-photo-grid>
        ${PHOTOS.map((p) => `<button type="button" data-photo="${p.id}" data-tags="${p.tags.join(" ")}" class="${state.bg.type === "photo" && state.bg.value === p.src ? "is-current" : ""}" style="background-image:url('${p.src}')"><span>${p.label}</span></button>`).join("")}
      </div>`;
    } else if (bgTab === "upload") {
      pane = `<label class="leto-file">${state.bg.type === "upload" ? "Басқа сурет жүктеу" : "Фон суретін жүктеу"}<input type="file" accept="image/*" data-bg-upload></label>
        <p class="leto-hint">${state.bg.type === "upload" ? "Жаңа файл ескі фонды ауыстырады." : "Жүктеген соң фотоны жылжытып, үлкейтіп, бұруға болады."}</p>`;
    } else {
      pane = `<p class="leto-hint">Мөлдір фон — PNG экспортында фонсыз шығады. Алдын ала қарауда тор көрінеді.</p>
        <button type="button" data-transparent="1" style="min-height:44px;width:100%;border:0;border-radius:14px;background:#2a2a33;color:#fff;font:800 13px/1 Arial,sans-serif">Мөлдір қосу</button>`;
    }
    return `
      <div class="leto-chips" data-bg-tabs>
        ${tabs.map(([id, label]) => `<button type="button" data-bg-tab="${id}" class="${bgTab === id ? "active" : ""}">${label}</button>`).join("")}
      </div>
      ${current}
      ${pane}
    `;
  }

  function renderGrad() {
    const cg = state.customGrad;
    const current = state.bg.type === "gradient" ? state.bg.value : "";
    return `
      <p class="leto-hint">Дайын градиент немесе өз екі түсің. Канваста бірден көрінеді.</p>
      <div class="leto-grad-grid">
        ${GRADS.map((g) => `<button type="button" data-grad="${g.id}" class="${current === g.css ? "is-current" : ""}" style="background:${g.css}">${g.label}</button>`).join("")}
      </div>
      <p class="leto-style-label">Өз градиент</p>
      <div class="leto-custom-grad">
        <div class="leto-custom-grad-preview" data-grad-preview style="background:${customGradCss()}"></div>
        <div class="leto-custom-grad-row">
          <label class="leto-custom-swatch">Бастау<input type="color" data-grad-from value="${cg.from}"></label>
          <label class="leto-custom-swatch">Аяғы<input type="color" data-grad-to value="${cg.to}"></label>
        </div>
        <div class="leto-track-row" style="margin-top:10px">
          <input type="range" min="0" max="360" value="${cg.angle}" data-grad-angle aria-label="Бұрыш" style="flex:1">
          <span class="leto-style-val" data-grad-angle-val>${cg.angle}°</span>
        </div>
        <button type="button" class="leto-custom-apply" data-grad-apply>Қолдану</button>
      </div>
    `;
  }

  function customGradCss() {
    const g = state.customGrad;
    return `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})`;
  }

  function renderStickers() {
    return `
      <p class="leto-hint">Стикерді басып қосыңыз. Кейін canvas-та жылжытуға болады.</p>
      <div class="leto-sticker-grid">
        ${STICKERS.map((s) => `<button type="button" data-sticker="${s}">${s}</button>`).join("")}
      </div>
    `;
  }

  const TEXT_LAYER_LABEL = { hook: "Негізгі", mark: "Екінші", extra: "Үшінші" };

  function textInputEls() {
    const editor = qs(".reels-copy-edit");
    return {
      editor,
      hook: editor?.querySelector('input[aria-label="Негізгі"]') || null,
      mark: editor?.querySelector('input[aria-label="Екінші"]') || null,
      extra: editor?.querySelector(".extra-input") || null,
    };
  }

  function renderTextSheet() {
    const chips = qsa(".text-layer-picks button[data-layer]");
    const active = chips.filter((c) => !c.hidden).map((c) => c.dataset.layer);
    const addBtn = qs(".text-add-btn");
    const canAdd = !!addBtn && !addBtn.hidden;
    if (!active.length) {
      return `<p class="leto-hint">Мәтін қабаттарын табу мүмкін болмады. Бетті жаңартып көріңіз.</p>`;
    }
    return `
      <p class="leto-hint">Мәтін жазыңыз. Қаріпті мәтінді басып өзгертесіз.</p>
      <div class="leto-text-list">
        ${active
          .map(
            (key) => `
          <div class="leto-text-row">
            <div class="row-head">
              <b>${TEXT_LAYER_LABEL[key] || key}</b>
              <div class="row-actions">
                ${active.length > 1 ? `<button type="button" class="row-remove" data-remove-layer="${key}">Өшіру</button>` : ""}
              </div>
            </div>
            <div class="row-slot" data-slot="${key}"></div>
          </div>`
          )
          .join("")}
      </div>
      ${
        canAdd
          ? `<button type="button" class="leto-text-add" data-native-add-text aria-label="Мәтін қосу">Мәтін қосу</button>`
          : ""
      }
    `;
  }

  function formatTrack(n) {
    const x = Number(n) || 0;
    if (x === 0) return "0";
    return `${x > 0 ? "+" : ""}${x}`;
  }

  function currentTracking() {
    const native = qs('.text-color-tools [data-native="tracking"]');
    if (native && native.value !== "") {
      const n = parseFloat(native.value);
      if (Number.isFinite(n)) return n;
    }
    const { el } = selectedLayerInfo();
    if (!el) return 0;
    const ls = getComputedStyle(el).letterSpacing;
    if (!ls || ls === "normal") return 0;
    const px = parseFloat(ls);
    return Number.isFinite(px) ? Math.round(px * 2) / 2 : 0;
  }

  function applyTracking(value) {
    const n = Math.max(-4, Math.min(16, Math.round(Number(value) * 2) / 2));
    const native = qs('.text-color-tools [data-native="tracking"]');
    if (native) setNative("tracking", String(n));
    else {
      const { el } = selectedLayerInfo();
      if (el) el.style.setProperty("letter-spacing", `${n}px`, "important");
    }
    const body = sheetEl("style")?.querySelector(".leto-sheet-body");
    const slider = body?.querySelector("[data-style-tracking]");
    const val = body?.querySelector("[data-style-tracking-val]");
    if (slider) slider.value = String(n);
    if (val) val.textContent = formatTrack(n);
  }

  function syncTrackingUi(body) {
    const root = body || sheetEl("style")?.querySelector(".leto-sheet-body");
    if (!root) return;
    const n = currentTracking();
    const slider = root.querySelector("[data-style-tracking]");
    const val = root.querySelector("[data-style-tracking-val]");
    if (slider) slider.value = String(n);
    if (val) val.textContent = formatTrack(n);
  }

  function currentTextShadow() {
    const native = qs(".text-color-tools [data-shadow-toggle]");
    if (native) return native.getAttribute("aria-pressed") !== "false";
    const { el } = selectedLayerInfo();
    if (!el) return true;
    const shadow = getComputedStyle(el).textShadow;
    return !!shadow && shadow !== "none";
  }

  function syncShadowUi(body) {
    const root = body || sheetEl("style")?.querySelector(".leto-sheet-body");
    if (!root) return;
    const on = currentTextShadow();
    const btn = root.querySelector("[data-text-shadow-toggle]");
    if (btn) {
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Қосулы" : "Өшірулі";
    }
    const intensity = currentShadowIntensity();
    const slider = root.querySelector("[data-style-shadow-intensity]");
    const val = root.querySelector("[data-style-shadow-intensity-val]");
    const row = root.querySelector(".leto-shadow-intensity");
    if (slider) slider.value = String(Math.round(intensity * 100));
    if (val) val.textContent = `${Math.round(intensity * 100)}%`;
    if (row) row.classList.toggle("is-off", !on);
  }

  function currentShadowIntensity() {
    const native = qs('.text-color-tools [data-native="shadowIntensity"]');
    if (native && native.value !== "") {
      const n = parseFloat(native.value);
      if (Number.isFinite(n)) return Math.max(0, Math.min(1, n));
    }
    return 0.55;
  }

  function applyShadowIntensity(value) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(value))));
    const n = pct / 100;
    const native = qs('.text-color-tools [data-native="shadowIntensity"]');
    if (native) setNative("shadowIntensity", String(n));
    else {
      const { el } = selectedLayerInfo();
      if (el) {
        if (n <= 0.01) el.style.setProperty("text-shadow", "none", "important");
        else {
          const y = Math.max(1, Math.round(2 + 4 * n));
          const blur = Math.max(2, Math.round(6 + 20 * n));
          el.style.setProperty("text-shadow", `0 ${y}px ${blur}px rgba(0,0,0,${n.toFixed(3)})`, "important");
        }
      }
    }
    syncShadowUi();
  }

  function toggleTextShadow() {
    const native = qs(".text-color-tools [data-shadow-toggle]");
    if (native) native.click();
    else {
      const { el } = selectedLayerInfo();
      if (!el) return;
      const on = currentTextShadow();
      if (on) el.style.setProperty("text-shadow", "none", "important");
      else applyShadowIntensity(currentShadowIntensity() * 100 || 55);
    }
    syncShadowUi();
  }

  function currentBgShadow() {
    const native = qs(".text-color-tools [data-bg-shadow-toggle]");
    if (native) return native.getAttribute("aria-pressed") !== "false";
    const { el } = selectedLayerInfo();
    if (!el) return true;
    const shadow = getComputedStyle(el).boxShadow;
    return !!shadow && shadow !== "none";
  }

  function currentBgShadowIntensity() {
    const native = qs('.text-color-tools [data-native="bgShadowIntensity"]');
    if (native && native.value !== "") {
      const n = parseFloat(native.value);
      if (Number.isFinite(n)) return Math.max(0, Math.min(1, n));
    }
    return 0.4;
  }

  function syncBgShadowUi(body) {
    const root = body || sheetEl("style")?.querySelector(".leto-sheet-body");
    if (!root) return;
    const on = currentBgShadow();
    const btn = root.querySelector("[data-style-bg-shadow-toggle]");
    if (btn) {
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Қосулы" : "Өшірулі";
    }
    const intensity = currentBgShadowIntensity();
    const slider = root.querySelector("[data-style-bg-shadow-intensity]");
    const val = root.querySelector("[data-style-bg-shadow-val]");
    const row = root.querySelector(".leto-bg-shadow-intensity");
    if (slider) slider.value = String(Math.round(intensity * 100));
    if (val) val.textContent = `${Math.round(intensity * 100)}%`;
    const hasBg = !root.querySelector("[data-style-bg-off]")?.classList.contains("active");
    if (row) row.classList.toggle("is-off", !hasBg || !on);
  }

  function applyBgShadowIntensity(value) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(value))));
    const n = pct / 100;
    const native = qs('.text-color-tools [data-native="bgShadowIntensity"]');
    if (native) setNative("bgShadowIntensity", String(n));
    syncBgShadowUi();
  }

  function toggleBgShadow() {
    const native = qs(".text-color-tools [data-bg-shadow-toggle]");
    if (native) native.click();
    syncBgShadowUi();
  }

  function mountTextInputs(body) {
    const inputs = textInputEls();
    qsa(".row-slot", body).forEach((slot) => {
      const key = slot.dataset.slot;
      const input = inputs[key];
      if (input) slot.appendChild(input);
    });
  }

  function unmountTextInputs() {
    const sheet = sheetEl("text");
    if (!sheet) return;
    const editor = qs(".reels-copy-edit");
    if (!editor) return;
    ["hook", "mark", "extra"].forEach((key) => {
      const slot = sheet.querySelector(`[data-slot="${key}"]`);
      const input = slot?.querySelector("input");
      if (input) editor.appendChild(input);
    });
  }

  function layerSelKey(el) {
    if (!el) return "hook";
    if (el.classList.contains("sub-mark")) return "mark";
    if (el.classList.contains("sub-extra")) return "extra";
    return "hook";
  }

  function selectedLayerInfo() {
    const stack = qs(".subtitle-stack");
    const selected = stack?.querySelector("[data-selected='1']");
    const key = layerSelKey(selected);
    const el = selected || stack?.querySelector(".sub-hook") || null;
    return { stack, el, key };
  }

  function rgbToHex(color, fallback = "#ffffff") {
    if (!color) return fallback;
    const raw = String(color).trim();
    if (raw[0] === "#") {
      const h = raw.slice(1);
      if (h.length === 3) return `#${h.split("").map((c) => c + c).join("")}`;
      if (h.length >= 6) return `#${h.slice(0, 6).toLowerCase()}`;
    }
    const m = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (!m) return fallback;
    return `#${[m[1], m[2], m[3]]
      .map((n) => Math.max(0, Math.min(255, Math.round(Number(n))))
        .toString(16)
        .padStart(2, "0"))
      .join("")}`;
  }

  function hexToHsv(hex) {
    const full = rgbToHex(hex, "#ffffff").slice(1);
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s: max === 0 ? 0 : d / max, v: max };
  }

  function hsvToHex(h, s, v) {
    const hue = ((h % 360) + 360) % 360;
    const c = v * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) [r, g, b] = [c, x, 0];
    else if (hue < 120) [r, g, b] = [x, c, 0];
    else if (hue < 180) [r, g, b] = [0, c, x];
    else if (hue < 240) [r, g, b] = [0, x, c];
    else if (hue < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    const to = (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return `#${to(r)}${to(g)}${to(b)}`;
  }

  function colorPopEl() {
    return qs(".leto-color-pop");
  }

  function ensureColorPop() {
    let pop = colorPopEl();
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "leto-color-pop";
    pop.innerHTML = `
      <button type="button" class="leto-color-pop-scrim" data-color-pop-close aria-label="Жабу"></button>
      <div class="leto-color-pop-card" role="dialog" aria-modal="true" aria-label="Түс">
        <div class="leto-color-pop-head">
          <h3>Түс</h3>
          <button type="button" class="leto-color-pop-x" data-color-pop-close aria-label="Жабу"></button>
        </div>
        <div class="leto-color-sv" data-color-sv>
          <div class="leto-color-sv-fill"></div>
          <div class="leto-color-knob" data-color-sv-knob></div>
        </div>
        <div class="leto-color-hue" data-color-hue>
          <div class="leto-color-hue-track"></div>
          <div class="leto-color-knob leto-color-hue-knob" data-color-hue-knob></div>
        </div>
      </div>
    `;
    document.body.appendChild(pop);
    const sv = pop.querySelector("[data-color-sv]");
    const hue = pop.querySelector("[data-color-hue]");
    const drag = (kind, ev) => {
      const node = kind === "sv" ? sv : hue;
      const rect = node.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / Math.max(1, rect.width)));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / Math.max(1, rect.height)));
      if (kind === "sv") {
        colorPop.s = x;
        colorPop.v = 1 - y;
      } else {
        colorPop.h = x * 360;
      }
      applyColorPop(false);
    };
    [["sv", sv], ["hue", hue]].forEach(([kind, node]) => {
      node.addEventListener("pointerdown", (ev) => {
        if (ev.button != null && ev.button !== 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        try {
          node.setPointerCapture(ev.pointerId);
        } catch {}
        drag(kind, ev);
      });
      node.addEventListener("pointermove", (ev) => {
        if (!node.hasPointerCapture(ev.pointerId)) return;
        drag(kind, ev);
      });
      node.addEventListener("pointerup", (ev) => {
        if (node.hasPointerCapture(ev.pointerId)) node.releasePointerCapture(ev.pointerId);
        applyColorPop(true);
      });
      node.addEventListener("pointercancel", () => applyColorPop(true));
    });
    pop.addEventListener("click", (e) => {
      if (e.target.closest("[data-color-pop-close]")) closeColorPop(true);
    });
    return pop;
  }

  function paintColorPop() {
    const pop = colorPopEl();
    if (!pop) return;
    const hex = hsvToHex(colorPop.h, colorPop.s, colorPop.v);
    const sv = pop.querySelector("[data-color-sv]");
    const svKnob = pop.querySelector("[data-color-sv-knob]");
    const hueKnob = pop.querySelector("[data-color-hue-knob]");
    sv.style.setProperty("--sv-hue", `hsl(${colorPop.h} 100% 50%)`);
    svKnob.style.left = `${colorPop.s * 100}%`;
    svKnob.style.top = `${(1 - colorPop.v) * 100}%`;
    svKnob.style.background = hex;
    hueKnob.style.left = `${(colorPop.h / 360) * 100}%`;
    hueKnob.style.background = `hsl(${colorPop.h} 100% 50%)`;
    const inputSel = colorPop.mode === "bg" ? "[data-style-bg-rgb]" : "[data-style-text-rgb]";
    const input = sheetEl("style")?.querySelector(inputSel);
    if (input) input.value = hex;
  }

  function applyColorPop(commit) {
    const hex = hsvToHex(colorPop.h, colorPop.s, colorPop.v);
    if (colorPop.mode === "bg") {
      setNative("bg", hex);
      const body = sheetEl("style")?.querySelector(".leto-sheet-body");
      body?.querySelector("[data-style-bg-off]")?.classList.remove("active");
      body?.querySelectorAll(".leto-bg-extra").forEach((el) => el.classList.remove("is-off"));
      syncBgShadowUi(body);
    } else {
      setNative("text", hex);
    }
    paintColorPop();
    if (commit) {
      pushHistory();
      save();
    }
  }

  function openColorPop(mode, hex) {
    const pop = ensureColorPop();
    const hsv = hexToHsv(hex || (mode === "bg" ? currentBgHex() : currentTextHex()));
    colorPop.on = true;
    colorPop.mode = mode === "bg" ? "bg" : "text";
    colorPop.h = hsv.h;
    colorPop.s = hsv.s;
    colorPop.v = hsv.v;
    pop.classList.add("on");
    paintColorPop();
  }

  function closeColorPop(commit) {
    const pop = colorPopEl();
    if (!colorPop.on) {
      pop?.classList.remove("on");
      return;
    }
    if (commit) applyColorPop(true);
    colorPop.on = false;
    pop?.classList.remove("on");
  }

  function bindColorPop() {
    if (document.documentElement.dataset.colorPopBound === "1") return;
    document.documentElement.dataset.colorPopBound = "1";
    document.addEventListener(
      "pointerdown",
      (e) => {
        const pick = e.target.closest(".leto-rgb-pick");
        if (!pick) return;
        e.preventDefault();
        e.stopPropagation();
        const input = pick.querySelector("input[type=color]");
        const mode = input?.hasAttribute("data-style-bg-rgb") ? "bg" : "text";
        openColorPop(mode, input?.value);
      },
      true
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && colorPop.on) closeColorPop(true);
    });
  }

  function currentTextHex() {
    const native = qs('.text-color-tools [data-native="text"]');
    if (native?.value) return rgbToHex(native.value, "#ffffff");
    const { el } = selectedLayerInfo();
    return rgbToHex(el ? getComputedStyle(el).color : "", "#ffffff");
  }

  function currentBgHex() {
    const native = qs('.text-color-tools [data-native="bg"]');
    if (native?.value) return rgbToHex(native.value, "#d9ff47");
    const { el } = selectedLayerInfo();
    return rgbToHex(el ? getComputedStyle(el).backgroundColor : "", "#d9ff47");
  }

  function currentRadiusUi() {
    const native = qs('.text-color-tools [data-native="radius"]');
    let n = native && native.value !== "" ? parseFloat(native.value) : NaN;
    if (!Number.isFinite(n)) {
      const { el } = selectedLayerInfo();
      n = el ? parseFloat(getComputedStyle(el).borderRadius) : 40;
    }
    if (!Number.isFinite(n) || n >= 40) return 40;
    return Math.max(0, Math.round(n));
  }

  function radiusLabel(n) {
    return Number(n) >= 40 ? "макс" : `${n}px`;
  }

  function currentBgPad() {
    const layer = window.__qaripGesture?.getSelectedLayer?.();
    if (layer && layer.bgPad != null && layer.bgPad !== "") {
      const n = Number(layer.bgPad);
      if (Number.isFinite(n)) return Math.max(-20, Math.min(28, Math.round(n)));
    }
    const native = qs('.text-color-tools [data-native="bgPad"]');
    if (native && native.value !== "") {
      const n = parseFloat(native.value);
      if (Number.isFinite(n)) return Math.max(-20, Math.min(28, n));
    }
    return 7;
  }

  function currentFace() {
    const gestureFace = window.__qaripGesture?.getSelectedLayer?.()?.face;
    if (gestureFace) return gestureFace;
    const native = qs(".text-color-tools [data-face].active");
    if (native?.dataset.face) return native.dataset.face;
    const { el } = selectedLayerInfo();
    if (!el) return "regular";
    const style = getComputedStyle(el);
    const rec = recForSelected();
    const cuts = rec?.faces?.length ? rec.faces : DEFAULT_FACES;
    if (style.fontStyle === "italic" || style.fontStyle === "oblique") {
      const ital = cuts.find((f) => (f.style || "normal") === "italic");
      if (ital) return ital.id;
    }
    const w = parseInt(style.fontWeight, 10) || 400;
    let best = cuts[0];
    let dist = 9999;
    cuts.forEach((f) => {
      if ((f.style || "normal") === "italic") return;
      const d = Math.abs(Number(f.weight || 400) - w);
      if (d < dist) {
        dist = d;
        best = f;
      }
    });
    return best?.id || "regular";
  }

  function syncTextbarFace() {
    const face = currentFace();
    qsa(".leto-textbar [data-text-tool^='face-']").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.textTool === `face-${face}`);
    });
    qsa(".leto-face-row [data-face]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.face === face);
    });
  }

  function showTextbar() {
    setBgEdit(false);
    qs(".leto-textbar")?.classList.add("on");
    paintFaceGroup();
  }

  function applyFace(face) {
    const key = selectedLayerInfo().key;
    const nativeLayer = qs(`.text-layer-picks [data-layer="${key}"]`);
    if (nativeLayer && !nativeLayer.classList.contains("active")) nativeLayer.click();
    paintFaceGroup();
    if (window.__qaripGesture?.setFace?.(face)) {
      syncTextbarFace();
      pushHistory();
      save();
      return;
    }
    const btn = qs(`.text-color-tools [data-face="${face}"]`);
    if (btn) btn.click();
    else {
      const rec = recForSelected();
      const cut = facesOf(rec).find((f) => f.id === face);
      const { el } = selectedLayerInfo();
      if (el && cut) {
        el.style.setProperty("font-weight", String(cut.weight || 400), "important");
        el.style.setProperty("font-style", cut.style || "normal", "important");
      }
    }
    syncTextbarFace();
    pushHistory();
    save();
  }

  function setNative(name, value) {
    const input = qs(`.text-color-tools [data-native="${name}"]`);
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function renderStyleSheet() {
    const { el } = selectedLayerInfo();
    const cs = el ? getComputedStyle(el) : null;
    const bg = cs?.backgroundColor || "";
    const rgbaMatch = bg.match(/^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)$/);
    const alpha = rgbaMatch ? parseFloat(rgbaMatch[1]) : bg.startsWith("rgb(") ? 1 : bg && bg !== "transparent" ? 1 : 0;
    const hasBg = !!bg && bg !== "transparent" && alpha > 0.03;
    const face = currentFace();
    const rec = recForSelected();
    const cuts = facesOf(rec);
    const track = currentTracking();
    const shadowOn = currentTextShadow();
    const shadowPct = Math.round(currentShadowIntensity() * 100);
    const textHex = currentTextHex();
    const bgHex = currentBgHex();
    const radiusUi = currentRadiusUi();
    const padUi = currentBgPad();
    const bgShadowOn = currentBgShadow();
    const bgShadowPct = Math.round(currentBgShadowIntensity() * 100);
    return `
      <p class="leto-style-label">Мәтін түсі</p>
      <div class="leto-swatches">
        ${STYLE_SWATCHES.map((c) => `<button type="button" data-style-text-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
        <label class="leto-rgb-pick" title="RGB">
          <input type="color" data-style-text-rgb value="${textHex}" aria-label="Мәтін түсі RGB">
        </label>
      </div>
      <p class="leto-style-label">Жазу</p>
      <div class="leto-face-row" role="group" aria-label="Қаріп қалыңдығы">
        ${cuts
          .map((f) => {
            const name = faceLabel(f.label);
            return `<button type="button" data-face="${escapeAttr(f.id)}" class="${faceIconClass(f)} ${face === f.id ? "active" : ""}" aria-label="${escapeAttr(name)}" title="${escapeAttr(name)}"><span aria-hidden="true">${faceIcon(f)}</span></button>`;
          })
          .join("")}
      </div>
      <div class="leto-track">
        <p class="leto-style-label">Интервал</p>
        <div class="leto-track-row">
          <button type="button" data-track-step="-0.5" aria-label="Тығыздау"></button>
          <input type="range" min="-4" max="16" step="0.5" value="${track}" data-style-tracking aria-label="Интервал">
          <button type="button" data-track-step="0.5" aria-label="Кеңейту"></button>
          <span class="leto-style-val" data-style-tracking-val>${formatTrack(track)}</span>
        </div>
      </div>
      <div class="leto-style-row-head leto-shadow-row">
        <p class="leto-style-label">Көлеңке</p>
        <button type="button" class="leto-style-bgoff${shadowOn ? " active" : ""}" data-text-shadow-toggle aria-pressed="${shadowOn ? "true" : "false"}">${shadowOn ? "Қосулы" : "Өшірулі"}</button>
      </div>
      <div class="leto-track leto-shadow-intensity${!shadowOn ? " is-off" : ""}">
        <p class="leto-style-label">Күш</p>
        <div class="leto-track-row">
          <input type="range" min="0" max="100" step="5" value="${shadowPct}" data-style-shadow-intensity aria-label="Көлеңке күші">
          <span class="leto-style-val" data-style-shadow-intensity-val>${shadowPct}%</span>
        </div>
      </div>
      <div class="leto-style-row-head">
        <p class="leto-style-label">Мәтін фоны</p>
        <button type="button" class="leto-style-bgoff${!hasBg ? " active" : ""}" data-style-bg-off>Жоқ</button>
      </div>
      <div class="leto-swatches">
        ${STYLE_SWATCHES.map((c) => `<button type="button" data-style-bg-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
        <label class="leto-rgb-pick" title="RGB">
          <input type="color" data-style-bg-rgb value="${bgHex}" aria-label="Мәтін фоны RGB">
        </label>
      </div>
      <div class="leto-track leto-bg-extra${!hasBg ? " is-off" : ""}" data-style-bg-radius-wrap>
        <p class="leto-style-label">Дөңгелектеу</p>
        <div class="leto-track-row">
          <input type="range" min="0" max="40" step="1" value="${radiusUi}" data-style-bg-radius aria-label="Дөңгелектеу">
          <span class="leto-style-val" data-style-radius-val>${radiusLabel(radiusUi)}</span>
        </div>
      </div>
      <div class="leto-track leto-bg-extra${!hasBg ? " is-off" : ""}" data-style-bg-size-wrap>
        <p class="leto-style-label">Өлшем</p>
        <div class="leto-track-row">
          <input type="range" min="-20" max="28" step="1" value="${padUi}" data-style-bg-pad aria-label="Фон өлшемі">
          <span class="leto-style-val" data-style-pad-val>${padUi}px</span>
        </div>
      </div>
      <div class="leto-style-row-head leto-bg-extra${!hasBg ? " is-off" : ""}">
        <p class="leto-style-label">Фон көлеңкесі</p>
        <button type="button" class="leto-style-bgoff${bgShadowOn ? " active" : ""}" data-style-bg-shadow-toggle aria-pressed="${bgShadowOn ? "true" : "false"}">${bgShadowOn ? "Қосулы" : "Өшірулі"}</button>
      </div>
      <div class="leto-track leto-bg-extra leto-bg-shadow-intensity${!hasBg || !bgShadowOn ? " is-off" : ""}">
        <p class="leto-style-label">Күш</p>
        <div class="leto-track-row">
          <input type="range" min="0" max="100" step="5" value="${bgShadowPct}" data-style-bg-shadow-intensity aria-label="Фон көлеңкесі">
          <span class="leto-style-val" data-style-bg-shadow-val>${bgShadowPct}%</span>
        </div>
      </div>
    `;
  }

  function renderGallery() {
    return `
      <p class="leto-hint">Логотип немесе сурет жүктеңіз — Stories үстіне қойылады.</p>
      <label class="leto-file">Сурет / логотип жүктеу<input type="file" accept="image/*" data-logo-upload></label>
      <div class="leto-chips">
        ${["top-left","top-center","top-right","center","bottom-left","bottom-center","bottom-right"]
          .map((p) => `<button type="button" data-logo-pos="${p}" class="${state.logo.pos === p ? "active" : ""}">${p}</button>`)
          .join("")}
      </div>
      <p class="leto-hint" data-logo-meta>Өлшем: ${state.logo.size}% · Мөлдірлік: ${state.logo.opacity}%</p>
      <input type="range" min="8" max="90" value="${state.logo.size}" data-logo-size style="width:100%">
      <input type="range" min="20" max="100" value="${state.logo.opacity}" data-logo-opacity style="width:100%;margin-top:8px">
      ${state.logo.src ? `<button type="button" data-logo-clear style="margin-top:10px;min-height:42px;width:100%;border:0;border-radius:12px;background:#2a2a33;color:#fff">Логотипті өшіру</button>` : ""}
    `;
  }

  function renderLayers() {
    const layers = [
      { id: "bg", label: "Фон" },
      { id: "hook", label: "Акцент мәтін" },
      { id: "mark", label: "Қосымша мәтін" },
      { id: "extra", label: "Қосымша жол" },
      { id: "logo", label: "Логотип", off: !state.logo.src },
      ...state.stickers.map((s, i) => ({ id: `sticker-${i}`, label: `Стикер ${s.char}` })),
    ].filter((l) => !l.off);
    return `<div class="leto-layer-list">${layers
      .map((l) => `<button type="button" data-layer-focus="${l.id}"><span>${l.label}</span><span>›</span></button>`)
      .join("")}</div>`;
  }

  function renderHelp() {
    return `
      <div class="leto-help">
        <p><b>Story қалай жасалады?</b></p>
        <ol>
          <li>Фон таңдаңыз</li>
          <li>Мәтін қосыңыз</li>
          <li>Қаріп таңдаңыз</li>
          <li>Story-ді жүктеңіз</li>
        </ol>
        <p class="leto-hint">Фото немесе логотип — төмендегі «Фото» батырмасынан.</p>
      </div>
    `;
  }

  function bindSheetBody(id, body) {
    body.onclick = (e) => {
      const removeLayerBtn = e.target.closest("[data-remove-layer]");
      if (removeLayerBtn) {
        const key = removeLayerBtn.dataset.removeLayer;
        unmountTextInputs();
        qs(`.text-layer-picks [data-layer="${key}"] .layer-x`)?.click();
        pushHistory();
        save();
        renderSheet("text");
        return;
      }
      const styleLayerBtn = e.target.closest("[data-style-layer]");
      if (styleLayerBtn) {
        const key = styleLayerBtn.dataset.styleLayer;
        unmountTextInputs();
        qs(`.text-layer-picks [data-layer="${key}"]`)?.click();
        openSheet("style");
        return;
      }
      const fontLayerBtn = e.target.closest("[data-font-layer]");
      if (fontLayerBtn) {
        const key = fontLayerBtn.dataset.fontLayer;
        unmountTextInputs();
        qs(`.text-layer-picks [data-layer="${key}"]`)?.click();
        openSheet("fonts");
        return;
      }
      const trackStep = e.target.closest("[data-track-step]");
      if (trackStep) {
        applyTracking(currentTracking() + Number(trackStep.dataset.trackStep));
        return;
      }
      if (e.target.closest("[data-text-shadow-toggle]")) {
        toggleTextShadow();
        pushHistory();
        save();
        return;
      }
      if (e.target.closest("[data-style-bg-shadow-toggle]")) {
        toggleBgShadow();
        pushHistory();
        save();
        return;
      }
      if (e.target.closest("[data-native-add-text]")) {
        unmountTextInputs();
        qs(".text-add-btn")?.click();
        pushHistory();
        save();
        renderSheet("text");
        setTimeout(() => {
          const chips = qsa(".text-layer-picks button[data-layer]").filter((c) => !c.hidden);
          const last = chips[chips.length - 1];
          const key = last?.dataset.layer;
          const input = key && textInputEls()[key];
          input?.focus();
        }, 30);
        return;
      }

      const add = e.target.closest("[data-add]");
      if (add) {
        openSheet(add.dataset.add);
        return;
      }

      const layoutBtn = e.target.closest("[data-layout]");
      if (layoutBtn) {
        state.layout = layoutBtn.dataset.layout;
        pushHistory();
        save();
        applyLayout();
        renderSheet("layout");
        return;
      }

      const favFont = e.target.closest("[data-fav-font]");
      if (favFont) {
        e.stopPropagation();
        const name = favFont.dataset.favFont;
        if (fontFavs.includes(name)) fontFavs = fontFavs.filter((x) => x !== name);
        else fontFavs.push(name);
        save();
        renderSheet("fonts");
        return;
      }
      const fontBtn = e.target.closest("[data-font-name]");
      if (fontBtn && !e.target.closest("[data-fav-font]") && !e.target.closest("[data-font-cut]")) {
        const name = fontBtn.dataset.fontName;
        const rec = recByName(name);
        if (rec?.faces?.length > 1) {
          fontWeightStep = rec;
          renderSheet("fonts");
          loadFontFaces(rec);
          return;
        }
        fontWeightStep = null;
        state.lastFontName = name;
        applyFont(decodeURIComponent(fontBtn.dataset.fontFamily), name, fontBtn.dataset.fontUrl);
        paintFaceGroup();
        closeSheets();
        showTextbar();
        return;
      }
      if (e.target.closest("[data-font-weight-back]")) {
        fontWeightStep = null;
        renderSheet("fonts");
        return;
      }
      const cutBtn = e.target.closest("[data-font-cut]");
      if (cutBtn) {
        const rec = recByName(cutBtn.dataset.fontName) || fontWeightStep;
        const cutId = cutBtn.dataset.fontCut;
        const cut = facesOf(rec).find((f) => f.id === cutId);
        state.lastFontName = cutBtn.dataset.fontName;
        fontWeightStep = null;
        applyFont(decodeURIComponent(cutBtn.dataset.fontFamily), cutBtn.dataset.fontName, cut?.url || cutBtn.dataset.fontUrl, cutId);
        closeSheets();
        showTextbar();
        return;
      }
      const fontCatBtn = e.target.closest("[data-font-cat]");
      if (fontCatBtn) {
        fontCat = fontCatBtn.dataset.fontCat;
        fontWeightStep = null;
        renderSheet("fonts");
        return;
      }

      const favPair = e.target.closest("[data-fav-pair]");
      if (favPair) {
        e.stopPropagation();
        const name = favPair.dataset.favPair;
        if (pairFavs.includes(name)) pairFavs = pairFavs.filter((x) => x !== name);
        else pairFavs.push(name);
        save();
        renderSheet("pairs");
        return;
      }
      const pairBtn = e.target.closest("[data-pair]");
      if (pairBtn && !e.target.closest("[data-fav-pair]")) {
        applyPair(pairBtn.dataset.pair);
        closeSheets();
        return;
      }
      const pairGroupBtn = e.target.closest("[data-pair-group]");
      if (pairGroupBtn) {
        pairGroup = pairGroupBtn.dataset.pairGroup;
        renderSheet("pairs");
        return;
      }

      const bgTabBtn = e.target.closest("[data-bg-tab]");
      if (bgTabBtn) {
        bgTab = bgTabBtn.dataset.bgTab;
        renderSheet("bg");
        return;
      }
      const solid = e.target.closest("[data-solid]");
      if (solid) {
        state.bg = { ...state.bg, type: "solid", value: solid.dataset.solid };
        pushHistory();
        save();
        applyBackground();
        return;
      }
      const grad = e.target.closest("[data-grad]");
      if (grad) {
        const g = GRADS.find((x) => x.id === grad.dataset.grad);
        state.bg = { ...state.bg, type: "gradient", value: g.css };
        pushHistory();
        save();
        applyBackground();
        if (id === "grad") renderSheet("grad");
        return;
      }
      const photo = e.target.closest("[data-photo]");
      if (photo) {
        const p = PHOTOS.find((x) => x.id === photo.dataset.photo);
        state.bg = { ...state.bg, type: "photo", value: p.src, x: 0, y: 0, scale: 1, rotate: 0 };
        pushHistory();
        save();
        applyBackground();
        closeSheets();
        setBgEdit(true);
        return;
      }
      const photoTag = e.target.closest("[data-photo-tag]");
      if (photoTag) {
        const tag = photoTag.dataset.photoTag;
        body.querySelectorAll("[data-photo-tag]").forEach((b) => b.classList.toggle("active", b === photoTag));
        body.querySelectorAll("[data-photo]").forEach((b) => {
          b.hidden = tag !== "all" && !(b.dataset.tags || "").includes(tag);
        });
        return;
      }
      if (e.target.closest("[data-grad-apply]")) {
        state.bg = { ...state.bg, type: "gradient", value: customGradCss() };
        pushHistory();
        save();
        applyBackground();
        return;
      }
      if (e.target.closest("[data-transparent]") || e.target.closest("[data-bg-clear]")) {
        state.bg = { ...state.bg, type: "transparent", value: "", x: 0, y: 0, scale: 1, rotate: 0 };
        pushHistory();
        save();
        applyBackground();
        setBgEdit(false);
        renderSheet("bg");
        return;
      }
      if (e.target.closest("[data-bg-reset]")) {
        resetBgTransform();
        return;
      }

      const sticker = e.target.closest("[data-sticker]");
      if (sticker) {
        addSticker(sticker.dataset.sticker);
        closeSheets();
        return;
      }

      const logoPos = e.target.closest("[data-logo-pos]");
      if (logoPos) {
        state.logo.pos = logoPos.dataset.logoPos;
        const spot = LOGO_POS[state.logo.pos] || LOGO_POS["top-right"];
        state.logo.x = spot.x;
        state.logo.y = spot.y;
        pushHistory();
        save();
        applyLogo();
        renderSheet("gallery");
        return;
      }
      if (e.target.closest("[data-logo-clear]")) {
        state.logo.src = "";
        pushHistory();
        save();
        applyLogo();
        renderSheet("gallery");
        return;
      }

      const layer = e.target.closest("[data-layer-focus]");
      if (layer) {
        focusLayer(layer.dataset.layerFocus);
        closeSheets();
        return;
      }

      const more = e.target.closest("[data-more]");
      if (more) {
        const m = more.dataset.more;
        if (m === "png") exportPng({ transparent: false });
        if (m === "transparent") exportPng({ transparent: true });
        if (m === "share") qsa(".reels-act").find((b) => /Бөлісу|Көшірілді/i.test(b.textContent || ""))?.click();
        if (m === "sticker") qs(".reels-sticker")?.click();
        if (m === "help") {
          openSheet("help");
          return;
        }
        if (m === "new") {
          if (confirm("Қазіргі дизайн өшеді. Жаңа Story бастайсыз ба?")) resetStory();
        }
        closeSheets();
      }

      const faceBtn = e.target.closest(".leto-face-row [data-face]");
      if (faceBtn) {
        applyFace(faceBtn.dataset.face);
        renderSheet("style");
        return;
      }

      const styleTextColor = e.target.closest("[data-style-text-color]");
      if (styleTextColor) {
        setNative("text", styleTextColor.dataset.styleTextColor);
        const rgb = body.querySelector("[data-style-text-rgb]");
        if (rgb) rgb.value = styleTextColor.dataset.styleTextColor;
        return;
      }
      const styleBgColor = e.target.closest("[data-style-bg-color]");
      if (styleBgColor) {
        setNative("bg", styleBgColor.dataset.styleBgColor);
        renderSheet("style");
        return;
      }
      if (e.target.closest("[data-style-bg-off]")) {
        qs(".text-color-tools .bg-off")?.click();
        renderSheet("style");
        return;
      }
    };

    body.onfocusin = (e) => {
      const slot = e.target.closest(".row-slot");
      if (!slot) return;
      const key = slot.dataset.slot;
      if (key) qs(`.text-layer-picks [data-layer="${key}"]`)?.click();
      syncTrackingUi(body);
      syncShadowUi(body);
      syncBgShadowUi(body);
    };

    body.oninput = (e) => {
      if (e.target.matches("[data-font-search]")) {
        fontQuery = e.target.value;
        clearTimeout(body._t);
        body._t = setTimeout(() => renderSheet("fonts"), 120);
      }
      if (e.target.matches("[data-solid-custom]")) {
        state.bg = { ...state.bg, type: "solid", value: e.target.value };
        save();
        applyBackground();
      }
      if (e.target.matches("[data-grad-from], [data-grad-to], [data-grad-angle]")) {
        if (e.target.matches("[data-grad-from]")) state.customGrad.from = e.target.value;
        if (e.target.matches("[data-grad-to]")) state.customGrad.to = e.target.value;
        if (e.target.matches("[data-grad-angle]")) state.customGrad.angle = Number(e.target.value);
        const preview = qs("[data-grad-preview]", body);
        if (preview) preview.style.background = customGradCss();
        const ang = qs("[data-grad-angle-val]", body);
        if (ang) ang.textContent = `${state.customGrad.angle}°`;
        state.bg = { ...state.bg, type: "gradient", value: customGradCss() };
        applyBackground();
      }
      if (e.target.matches("[data-logo-size]")) {
        state.logo.size = clampLogoSize(e.target.value);
        save();
        applyLogo();
      }
      if (e.target.matches("[data-logo-opacity]")) {
        state.logo.opacity = Number(e.target.value);
        save();
        applyLogo();
      }
      if (e.target.matches("[data-style-tracking]")) {
        applyTracking(e.target.value);
      }
      if (e.target.matches("[data-style-shadow-intensity]")) {
        applyShadowIntensity(e.target.value);
      }
      if (e.target.matches("[data-style-bg-shadow-intensity]")) {
        applyBgShadowIntensity(e.target.value);
      }
      if (e.target.matches("[data-style-text-rgb]")) {
        setNative("text", e.target.value);
      }
      if (e.target.matches("[data-style-bg-rgb]")) {
        setNative("bg", e.target.value);
        body.querySelector("[data-style-bg-off]")?.classList.remove("active");
        body.querySelectorAll(".leto-bg-extra").forEach((el) => el.classList.remove("is-off"));
        syncBgShadowUi(body);
      }
      if (e.target.matches("[data-style-bg-opacity]")) {
        setNative("bgOpacity", e.target.value);
        const val = qs("[data-style-opacity-val]", body);
        if (val) val.textContent = `${Math.round(Number(e.target.value) * 100)}%`;
      }
      if (e.target.matches("[data-style-bg-radius]")) {
        const n = Math.max(0, Math.min(40, Number(e.target.value) || 0));
        setNative("radius", String(n));
        const val = qs("[data-style-radius-val]", body);
        if (val) val.textContent = radiusLabel(n);
      }
      if (e.target.matches("[data-style-bg-pad]")) {
        const n = Math.max(-20, Math.min(28, Number(e.target.value) || 0));
        setNative("bgPad", String(n));
        const val = qs("[data-style-pad-val]", body);
        if (val) val.textContent = `${n}px`;
      }
    };
    body.onchange = (e) => {
      if (e.target.matches("[data-grad-from], [data-grad-to], [data-grad-angle]")) {
        pushHistory();
        save();
        return;
      }
      if (e.target.matches("[data-bg-upload]")) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          state.bg = { ...state.bg, type: "upload", value: String(reader.result || ""), fit: "cover", x: 0, y: 0, scale: 1, rotate: 0 };
          pushHistory();
          save();
          applyBackground();
          closeSheets();
          setBgEdit(true);
        };
        reader.readAsDataURL(file);
      }
      if (e.target.matches("[data-logo-upload]")) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          state.logo.src = String(reader.result || "");
          pushHistory();
          save();
          applyLogo();
          selectLogo();
          closeSheets();
        };
        reader.readAsDataURL(file);
      }
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  function applyPair(name) {
    if (name === "random") {
      qs(".reels-options:not(.reels-colors) button.random")?.click();
      state.lastPair = "random";
    } else {
      const btn = qsa(".reels-options:not(.reels-colors) > button").find((b) => (b.textContent || "").includes(name.split(" × ")[0]));
      btn?.click();
      state.lastPair = name;
    }
    pushHistory();
    save();
  }

  function ensureGoogleFont(family) {
    const fam = String(family || "").replace(/^["']|["']$/g, "").split(",")[0].trim();
    if (!fam) return Promise.resolve();
    const id = `qarip-gf-${fam.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam)}:ital,wght@0,400;0,700;1,400&display=swap`;
      document.head.appendChild(link);
    }
    return document.fonts?.load ? document.fonts.load(`24px "${fam}"`) : Promise.resolve();
  }

  function applyFont(family, name, url, faceId) {
    const rec = (FONT_DATA || []).find((f) => f.name === name);
    const src = url || rec?.preview || "";
    const fam = String(family || rec?.family || "").replace(/["']/g, "").split(",")[0].trim();
    state.lastFontName = name || state.lastFontName;
    const paint = () => {
      const applied = window.__qaripGesture?.applyFont?.(fam, name, faceId || "");
      if (!applied) {
        const item = qsa(".reels-font-item").find((el) => el.dataset.name === name);
        if (item) {
          item.click();
        } else {
          const stack = qs(".subtitle-stack");
          const selected =
            stack?.querySelector('[data-selected="1"]') ||
            stack?.querySelector(".sub-hook");
          if (selected && fam) {
            selected.style.setProperty("font-family", `"${fam}"`, "important");
          }
        }
        if (faceId) applyFace(faceId);
      }
      paintFaceGroup();
      pushHistory();
      save();
    };
    loadFontFaces(rec || { family: fam, preview: src, faces: src && !src.startsWith("google:") ? [{ url: src, weight: "400", style: "normal" }] : [] }).then(paint);
  }

  function hasBgPhoto() {
    return (state.bg.type === "photo" || state.bg.type === "upload") && !!state.bg.value;
  }

  function bgXform() {
    const b = state.bg || {};
    const scale = Number(b.scale);
    return {
      x: Number(b.x) || 0,
      y: Number(b.y) || 0,
      scale: Number.isFinite(scale) && scale > 0 ? scale : 1,
      rotate: Number(b.rotate) || 0,
    };
  }

  function clampBgScale(n) {
    return Math.max(0.2, Math.min(6, n));
  }

  function clampLogoSize(n) {
    const v = Number(n);
    return Math.max(8, Math.min(90, Number.isFinite(v) ? v : 18));
  }

  function syncLogoSizeUi() {
    const size = clampLogoSize(state.logo.size);
    const input = qs("[data-logo-size]");
    if (input && document.activeElement !== input) input.value = String(Math.round(size));
    const meta = qs("[data-logo-meta]");
    if (meta) meta.textContent = `Өлшем: ${Math.round(size)}% · Мөлдірлік: ${state.logo.opacity || 100}%`;
  }

  function selectLogo() {
    if (!state.logo.src) return;
    setBgEdit(false);
    clearTextSelect();
    const wrap = qs(".stories-logo");
    if (wrap && !wrap.hidden) wrap.dataset.selected = "1";
  }

  function resetBgTransform() {
    if (!hasBgPhoto()) return;
    state.bg = { ...state.bg, x: 0, y: 0, scale: 1, rotate: 0 };
    pushHistory();
    save();
    applyBgTransform();
  }

  function clearTextSelect() {
    if (typeof window.__qaripGesture?.clearSelect === "function") {
      window.__qaripGesture.clearSelect();
    } else {
      const stack = qs(".subtitle-stack");
      stack?.querySelectorAll("[data-selected]").forEach((el) => el.removeAttribute("data-selected"));
      stack?.querySelectorAll("[data-editing='1']").forEach((el) => {
        el.removeAttribute("data-editing");
        el.removeAttribute("contenteditable");
      });
      const hud = qs(".reels-hud");
      if (hud) hud.dataset.show = "0";
    }
    qs(".leto-textbar")?.classList.remove("on");
  }

  function clearLogoSelect() {
    qs(".stories-logo")?.removeAttribute("data-selected");
  }

  function logoXY(L = state.logo) {
    const x = Number(L.x);
    const y = Number(L.y);
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
    return LOGO_POS[L.pos] || LOGO_POS["top-right"];
  }

  function lockStageScroll() {
    if (lockStageScroll.on) return;
    lockStageScroll.on = true;
    const block = (ev) => {
      if (ev.cancelable) ev.preventDefault();
    };
    const stop = () => {
      lockStageScroll.on = false;
      window.removeEventListener("touchmove", block, true);
      window.removeEventListener("pointerup", stop, true);
      window.removeEventListener("pointercancel", stop, true);
    };
    window.addEventListener("touchmove", block, { passive: false, capture: true });
    window.addEventListener("pointerup", stop, { capture: true });
    window.addEventListener("pointercancel", stop, { capture: true });
  }

  function syncDock(mode) {
    qsa(".leto-dock-btn").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.acto === mode);
    });
  }

  function setBgEdit(on) {
    bgEdit = !!on && hasBgPhoto();
    const preview = qs(".phone-preview");
    if (!preview) return;
    preview.classList.toggle("leto-bg-edit", bgEdit);
    if (hasBgPhoto()) ensureBgHit(preview);
    if (bgEdit) {
      syncDock("bg");
      clearTextSelect();
      clearLogoSelect();
    } else {
      const dockId = ["bg", "gallery", "grad", "text"].includes(activeSheet) ? activeSheet : "";
      syncDock(dockId);
    }
  }

  function ensureBg(preview) {
    let bg = qs(".stories-bg", preview);
    if (!bg) {
      bg = document.createElement("div");
      bg.className = "stories-bg";
      preview.insertBefore(bg, preview.firstChild);
    }
    return bg;
  }

  function ensureBgPhoto(bg) {
    let img = qs(".stories-bg-photo", bg);
    if (!img) {
      img = document.createElement("img");
      img.className = "stories-bg-photo";
      img.alt = "";
      img.draggable = false;
      img.addEventListener("load", () => sizeBgPhoto(img));
      bg.append(img);
    }
    return img;
  }

  function sizeBgPhoto(img) {
    const preview = img.closest(".phone-preview");
    if (!preview || !img.naturalWidth) return;
    const box = preview.getBoundingClientRect();
    if (box.width < 8 || box.height < 8) return;
    const cover = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    img.style.width = `${Math.ceil(img.naturalWidth * cover)}px`;
    img.style.height = `${Math.ceil(img.naturalHeight * cover)}px`;
  }

  function applyBgTransform() {
    const preview = qs(".phone-preview");
    const img = qs(".stories-bg-photo", preview);
    if (!img) return;
    const { x, y, scale, rotate } = bgXform();
    img.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
  }

  function ensureBgHit(preview) {
    if (!preview) return;
    let hit = qs(".stories-bg-hit", preview);
    if (!hit) {
      hit = document.createElement("div");
      hit.className = "stories-bg-hit";
      preview.append(hit);
      bindBgGestures(hit);
    }
    let tools = qs(".stories-bg-tools", preview);
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "stories-bg-tools";
      tools.innerHTML = `<span class="stories-bg-hint">Фонды жылжытыңыз</span><button type="button" data-bg-reset>Қалпына</button>`;
      tools.addEventListener("click", (e) => {
        if (e.target.closest("[data-bg-reset]")) resetBgTransform();
      });
      preview.append(tools);
    }
    let scale = qs(".stories-bg-scale", preview);
    if (!scale) {
      scale = document.createElement("span");
      scale.className = "stories-scale-handle stories-bg-scale";
      scale.setAttribute("role", "slider");
      scale.setAttribute("aria-label", "Фон өлшемі");
      preview.append(scale);
      bindBgScaleHandle(scale);
    }
  }

  function removeBgChrome(preview) {
    qs(".stories-bg-hit", preview)?.remove();
    qs(".stories-bg-tools", preview)?.remove();
    qs(".stories-bg-scale", preview)?.remove();
  }

  function bindBgGestures(hit) {
    if (hit.dataset.bound === "1") return;
    hit.dataset.bound = "1";
    const pointers = new Map();
    let gesture = null;
    let dirty = false;

    const pts = () => [...pointers.values()];
    const commit = () => {
      if (!dirty) return;
      dirty = false;
      pushHistory();
      save();
    };

    hit.addEventListener("pointerdown", (e) => {
      if (!hasBgPhoto()) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setBgEdit(true);
      lockStageScroll();
      try {
        hit.setPointerCapture(e.pointerId);
      } catch {}
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const now = bgXform();
      if (pointers.size === 1) {
        gesture = {
          mode: e.shiftKey || e.altKey ? "rotate" : "pan",
          ...now,
          px: e.clientX,
          py: e.clientY,
        };
      } else if (pointers.size >= 2) {
        const [a, b] = pts();
        gesture = {
          mode: "pinch",
          ...now,
          dist: Math.hypot(b.x - a.x, b.y - a.y),
          ang: Math.atan2(b.y - a.y, b.x - a.x),
          mx: (a.x + b.x) / 2,
          my: (a.y + b.y) / 2,
        };
      }
    });

    hit.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId) || !gesture) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (gesture.mode === "pan") {
        state.bg.x = gesture.x + (e.clientX - gesture.px);
        state.bg.y = gesture.y + (e.clientY - gesture.py);
      } else if (gesture.mode === "rotate") {
        const preview = qs(".phone-preview");
        const r = preview.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const startAng = Math.atan2(gesture.py - cy, gesture.px - cx);
        const nowAng = Math.atan2(e.clientY - cy, e.clientX - cx);
        state.bg.rotate = gesture.rotate + ((nowAng - startAng) * 180) / Math.PI;
      } else if (gesture.mode === "pinch") {
        const pair = pts();
        if (pair.length < 2) return;
        const [a, b] = pair;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        state.bg.scale = clampBgScale(gesture.scale * (dist / Math.max(12, gesture.dist)));
        state.bg.rotate = gesture.rotate + ((ang - gesture.ang) * 180) / Math.PI;
        state.bg.x = gesture.x + (mx - gesture.mx);
        state.bg.y = gesture.y + (my - gesture.my);
      }
      dirty = true;
      applyBgTransform();
    });

    const endPointer = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        gesture = null;
        commit();
      } else if (pointers.size === 1) {
        const only = pts()[0];
        const now = bgXform();
        gesture = { mode: "pan", ...now, px: only.x, py: only.y };
      }
    };
    hit.addEventListener("pointerup", endPointer);
    hit.addEventListener("pointercancel", endPointer);

    hit.addEventListener(
      "wheel",
      (e) => {
        if (!hasBgPhoto()) return;
        e.preventDefault();
        e.stopPropagation();
        const factor = e.deltaY > 0 ? 0.94 : 1.06;
        const prev = bgXform();
        const nextScale = clampBgScale(prev.scale * factor);
        const k = nextScale / (prev.scale || 1);
        const preview = qs(".phone-preview");
        const r = preview.getBoundingClientRect();
        const lx = e.clientX - (r.left + r.width / 2) - prev.x;
        const ly = e.clientY - (r.top + r.height / 2) - prev.y;
        state.bg.scale = nextScale;
        state.bg.x = prev.x + lx - lx * k;
        state.bg.y = prev.y + ly - ly * k;
        applyBgTransform();
        dirty = true;
        clearTimeout(hit._wheelSave);
        hit._wheelSave = setTimeout(commit, 280);
      },
      { passive: false }
    );
  }

  function bindBgScaleHandle(handle) {
    if (handle.dataset.bound === "1") return;
    handle.dataset.bound = "1";
    handle.addEventListener("pointerdown", (e) => {
      if (!hasBgPhoto()) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setBgEdit(true);
      lockStageScroll();
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {}
      const preview = qs(".phone-preview");
      const r = preview.getBoundingClientRect();
      const now = bgXform();
      const cx = r.left + r.width / 2 + now.x;
      const cy = r.top + r.height / 2 + now.y;
      const startDist = Math.max(12, Math.hypot(e.clientX - cx, e.clientY - cy));
      const startScale = now.scale;
      let dirty = false;
      const move = (ev) => {
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        state.bg.scale = clampBgScale(startScale * (dist / startDist));
        dirty = true;
        applyBgTransform();
      };
      const end = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        if (dirty) {
          pushHistory();
          save();
        }
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  }

  function ensureLogo(preview) {
    let wrap = qs(".stories-logo", preview);
    if (wrap && wrap.tagName === "IMG") {
      wrap.remove();
      wrap = null;
    }
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "stories-logo";
      wrap.hidden = true;
      const img = document.createElement("img");
      img.className = "stories-logo-img";
      img.alt = "Logo";
      img.draggable = false;
      wrap.append(img);
      preview.append(wrap);
    }
    if (!qs(".stories-logo-img", wrap)) {
      const img = document.createElement("img");
      img.className = "stories-logo-img";
      img.alt = "Logo";
      img.draggable = false;
      wrap.prepend(img);
    }
    if (!qs(".stories-scale-handle", wrap)) {
      const handle = document.createElement("span");
      handle.className = "stories-scale-handle";
      handle.setAttribute("role", "slider");
      handle.setAttribute("aria-label", "Өлшем");
      wrap.append(handle);
    }
    bindLogoGestures(wrap);
    return wrap;
  }

  function applyBackground() {
    const preview = qs(".phone-preview");
    if (!preview) return;
    const bg = ensureBg(preview);
    const b = state.bg;
    preview.dataset.bg = b.type;
    bg.style.backgroundPosition = "";
    bg.style.backgroundSize = "";
    const photoOn = b.type === "photo" || b.type === "upload";
    if (b.type === "solid") {
      bg.style.backgroundImage = "none";
      bg.style.backgroundColor = b.value || "#101014";
    } else if (b.type === "gradient" || b.type === "grad") {
      bg.style.backgroundColor = "transparent";
      bg.style.backgroundImage = b.value;
    } else if (photoOn) {
      bg.style.backgroundColor = "#101014";
      bg.style.backgroundImage = "none";
    } else {
      bg.style.backgroundColor = "transparent";
      bg.style.backgroundImage = "";
    }
    const img = photoOn && b.value ? ensureBgPhoto(bg) : qs(".stories-bg-photo", bg);
    if (photoOn && b.value && img) {
      img.hidden = false;
      if (img.getAttribute("src") !== b.value) img.src = b.value;
      else sizeBgPhoto(img);
      applyBgTransform();
    } else if (img) {
      img.hidden = true;
      img.removeAttribute("src");
    }
    if (hasBgPhoto()) ensureBgHit(preview);
    else {
      bgEdit = false;
      preview.classList.remove("leto-bg-edit");
      removeBgChrome(preview);
    }
  }

  function applyLogo() {
    const preview = qs(".phone-preview");
    if (!preview) return;
    const wrap = ensureLogo(preview);
    const img = qs(".stories-logo-img", wrap);
    const L = state.logo;
    if (!L.src) {
      wrap.hidden = true;
      wrap.removeAttribute("data-selected");
      if (img) img.removeAttribute("src");
      return;
    }
    wrap.hidden = false;
    L.size = clampLogoSize(L.size);
    if (img && img.getAttribute("src") !== L.src) img.src = L.src;
    const { x, y } = logoXY(L);
    L.x = x;
    L.y = y;
    wrap.style.left = `${x}%`;
    wrap.style.top = `${y}%`;
    wrap.style.transform = "translate(-50%, -50%)";
    wrap.style.width = `${L.size}%`;
    wrap.style.opacity = String((L.opacity || 100) / 100);
    syncLogoSizeUi();
  }

  function applyLayout() {
    const stack = qs(".subtitle-stack");
    if (!stack) return;
    const layout = LAYOUTS[state.layout] || LAYOUTS.center;
    const align = state.text.align || "center";
    [
      [".sub-hook", layout.hook],
      [".sub-mark", layout.mark],
      [".sub-extra", layout.extra],
    ].forEach(([sel, top]) => {
      const el = qs(sel, stack);
      if (!el) return;
      el.style.setProperty("top", `${top}%`, "important");
      el.style.setProperty("text-align", align, "important");
      el.style.setProperty("left", align === "left" ? "12%" : align === "right" ? "88%" : "50%", "important");
      el.style.setProperty("max-width", `${state.text.maxWidth || 86}%`, "important");
      if (el.dataset.hasBg !== "1") {
        el.style.setProperty("line-height", String((state.text.lineHeight || 100) / 100), "important");
      }
    });
    const scale = (state.text.size || 100) / 100;
    const hook = qs(".sub-hook", stack);
    const mark = qs(".sub-mark", stack);
    if (hook) hook.style.setProperty("font-size", `calc(var(--reel-hook, 34px) * ${scale})`, "important");
    if (mark) mark.style.setProperty("font-size", `calc(var(--reel-mark, 18px) * ${scale})`, "important");
    window.__qaripGesture?.refreshLooks?.();
  }

  function addSticker(char) {
    const preview = qs(".phone-preview");
    if (!preview) return;
    const id = `s${Date.now()}`;
    const item = { id, char, x: 50, y: 40 + Math.random() * 20 };
    state.stickers.push(item);
    pushHistory();
    save();
    paintStickers();
  }

  function paintStickers() {
    const preview = qs(".phone-preview");
    if (!preview) return;
    qsa(".leto-sticker", preview).forEach((el) => el.remove());
    state.stickers.forEach((s) => {
      const el = document.createElement("div");
      el.className = "leto-sticker";
      el.dataset.stickerId = s.id;
      el.textContent = s.char;
      el.style.left = `${s.x}%`;
      el.style.top = `${s.y}%`;
      bindStickerDrag(el, s);
      preview.append(el);
    });
  }

  function bindLogoGestures(wrap) {
    if (wrap.dataset.bound === "1") return;
    wrap.dataset.bound = "1";
    const pointers = new Map();
    let gesture = null;
    let dirty = false;

    const pts = () => [...pointers.values()];
    const commit = () => {
      if (!dirty) return;
      dirty = false;
      pushHistory();
      save();
    };
    const startSelect = () => {
      setBgEdit(false);
      clearTextSelect();
      wrap.dataset.selected = "1";
      lockStageScroll();
    };

    wrap.addEventListener("pointerdown", (e) => {
      if (wrap.hidden || !state.logo.src) return;
      if (e.target.closest(".stories-scale-handle")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startSelect();
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {}
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const preview = qs(".phone-preview");
      const r = preview.getBoundingClientRect();
      const pos = logoXY();
      if (pointers.size === 1) {
        gesture = {
          mode: "pan",
          px: e.clientX,
          py: e.clientY,
          sx: pos.x,
          sy: pos.y,
          rw: r.width,
          rh: r.height,
        };
      } else {
        const [a, b] = pts();
        gesture = {
          mode: "pinch",
          size: clampLogoSize(state.logo.size),
          dist: Math.max(12, Math.hypot(b.x - a.x, b.y - a.y)),
        };
      }
    });

    wrap.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId) || !gesture) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (gesture.mode === "pan") {
        const dx = ((e.clientX - gesture.px) / gesture.rw) * 100;
        const dy = ((e.clientY - gesture.py) / gesture.rh) * 100;
        if (Math.hypot(e.clientX - gesture.px, e.clientY - gesture.py) > 4) dirty = true;
        state.logo.x = Math.max(6, Math.min(94, gesture.sx + dx));
        state.logo.y = Math.max(6, Math.min(94, gesture.sy + dy));
        wrap.style.left = `${state.logo.x}%`;
        wrap.style.top = `${state.logo.y}%`;
      } else if (gesture.mode === "pinch") {
        const pair = pts();
        if (pair.length < 2) return;
        const [a, b] = pair;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        state.logo.size = clampLogoSize(gesture.size * (dist / gesture.dist));
        dirty = true;
        applyLogo();
      }
    });

    const endPointer = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        gesture = null;
        commit();
      } else if (pointers.size === 1) {
        const only = pts()[0];
        const preview = qs(".phone-preview");
        const r = preview.getBoundingClientRect();
        const pos = logoXY();
        gesture = {
          mode: "pan",
          px: only.x,
          py: only.y,
          sx: pos.x,
          sy: pos.y,
          rw: r.width,
          rh: r.height,
        };
      }
    };
    wrap.addEventListener("pointerup", endPointer);
    wrap.addEventListener("pointercancel", endPointer);

    wrap.addEventListener(
      "wheel",
      (e) => {
        if (wrap.hidden || !state.logo.src) return;
        e.preventDefault();
        e.stopPropagation();
        startSelect();
        state.logo.size = clampLogoSize(state.logo.size * (e.deltaY > 0 ? 0.94 : 1.06));
        applyLogo();
        dirty = true;
        clearTimeout(wrap._wheelSave);
        wrap._wheelSave = setTimeout(commit, 280);
      },
      { passive: false }
    );

    const handle = qs(".stories-scale-handle", wrap);
    if (!handle || handle.dataset.bound === "1") return;
    handle.dataset.bound = "1";
    handle.addEventListener("pointerdown", (e) => {
      if (wrap.hidden || !state.logo.src) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startSelect();
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {}
      const box = wrap.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const startDist = Math.max(12, Math.hypot(e.clientX - cx, e.clientY - cy));
      const startSize = clampLogoSize(state.logo.size);
      const move = (ev) => {
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        state.logo.size = clampLogoSize(startSize * (dist / startDist));
        dirty = true;
        applyLogo();
      };
      const end = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        commit();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  }

  function bindStickerDrag(el, data) {
    let start = null;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setBgEdit(false);
      clearTextSelect();
      clearLogoSelect();
      lockStageScroll();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      const preview = qs(".phone-preview");
      const r = preview.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, sx: data.x, sy: data.y, rw: r.width, rh: r.height };
    });
    el.addEventListener("pointermove", (e) => {
      if (!start) return;
      const dx = ((e.clientX - start.x) / start.rw) * 100;
      const dy = ((e.clientY - start.y) / start.rh) * 100;
      data.x = Math.max(5, Math.min(95, start.sx + dx));
      data.y = Math.max(5, Math.min(95, start.sy + dy));
      el.style.left = `${data.x}%`;
      el.style.top = `${data.y}%`;
    });
    el.addEventListener("pointerup", () => {
      start = null;
      save();
    });
  }

  function focusLayer(id) {
    const stack = qs(".subtitle-stack");
    if (id === "hook" || id === "mark" || id === "extra") {
      const el = qs(`.sub-${id}`, stack);
      el?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      qs(".leto-textbar")?.classList.add("on");
    }
    if (id === "bg") openSheet("bg");
    if (id === "logo") {
      selectLogo();
      openSheet("gallery");
    }
  }

  async function ensureHtml2Canvas() {
    if (window.html2canvas) return window.html2canvas;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "/tanba/vendor/html2canvas.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.html2canvas;
  }

  async function exportPng({ transparent = false } = {}) {
    const preview = qs(".phone-preview");
    if (!preview || exportPng.busy) return;
    exportPng.busy = true;
    const force = transparent || state.bg.type === "transparent";
    preview.classList.add("exporting");
    letoToast("Story дайындалуда…");
    qs(".stories-bg-hit", preview)?.setAttribute("hidden", "");
    qs(".stories-bg-tools", preview)?.setAttribute("hidden", "");
    if (force) {
      preview.dataset.bg = "transparent";
      const bg = qs(".stories-bg", preview);
      if (bg) {
        bg.style.opacity = "0";
        bg.style.background = "transparent";
      }
      preview.style.background = "transparent";
    }
    try {
      if (document.fonts?.ready) {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);
      }
      const html2canvas = await ensureHtml2Canvas();
      const scale = 1080 / preview.getBoundingClientRect().width;
      const canvas = await html2canvas(preview, { scale, useCORS: true, backgroundColor: null, logging: false });
      const a = document.createElement("a");
      a.download = force ? "qarip-story-transparent.png" : "qarip-story.png";
      const output = document.createElement("canvas");
      output.width = 1080;
      output.height = 1920;
      output.getContext("2d").drawImage(canvas, 0, 0, 1080, 1920);
      a.href = output.toDataURL("image/png");
      a.click();
      letoToast("Дайын!");
    } catch (err) {
      console.warn(err);
      letoToast("Story-ді жүктеу кезінде қате шықты. Қайта көріңіз.");
      qsa(".reels-act").find((b) => /9:16|PNG/i.test(b.textContent || ""))?.click();
    } finally {
      preview.classList.remove("exporting");
      qs(".stories-bg-hit", preview)?.removeAttribute("hidden");
      qs(".stories-bg-tools", preview)?.removeAttribute("hidden");
      applyBackground();
      exportPng.busy = false;
    }
  }

  function applyAll() {
    applyBackground();
    applyLogo();
    applyLayout();
    paintStickers();
  }

  let quickMode = false;

  function letoToast(msg) {
    let el = qs(".leto-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "leto-toast";
      document.body.append(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function watchNativeToast(cb) {
    const read = () => {
      const el = qs(".reels-sticker-toast");
      if (el && el.dataset.show === "1") {
        cb(el.textContent || "");
        return true;
      }
      return false;
    };
    if (read()) return;
    const obs = new MutationObserver(() => {
      if (read()) obs.disconnect();
    });
    obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-show"], childList: true });
    setTimeout(() => obs.disconnect(), 4000);
  }

  function copyStickerNative() {
    const btn = qs(".reels-sticker");
    if (!btn) return;
    btn.click();
    watchNativeToast((msg) => letoToast(msg || "Көшірілді."));
  }

  function updateExportButtonForMode() {
    const btn = qs(".leto-export");
    if (!btn) return;
    if (quickMode) {
      btn.textContent = "Көшіру";
      btn.setAttribute("aria-label", "Мәтінді қаріппен көшіру");
      btn.classList.add("is-sticker");
    } else {
      btn.textContent = "Жүктеу";
      btn.setAttribute("aria-label", "Жүктеу");
      btn.classList.remove("is-sticker");
    }
  }

  const choiceInert = new Map();
  function setChoiceModal(open) {
    const choice = qs(".leto-choice");
    if (!choice) return;
    if (open) {
      [...document.body.children].forEach(el => {
        if (el === choice || /^(SCRIPT|STYLE)$/.test(el.tagName)) return;
        if (!choiceInert.has(el)) choiceInert.set(el, el.hasAttribute("inert"));
        el.setAttribute("inert", "");
      });
      choice.querySelector('[data-choice="editor"]')?.focus();
    } else {
      choiceInert.forEach((wasInert, el) => { el.toggleAttribute("inert", wasInert); });
      choiceInert.clear();
    }
  }

  function leaveModeToChoice() {
    const choice = qs(".leto-choice");
    if (!choice || !choice.classList.contains("done")) return false;
    closeSheets();
    qs(".leto-textbar")?.classList.remove("on");
    choice.classList.remove("done");
    choice.removeAttribute("hidden");
    choice.setAttribute("aria-hidden", "false");
    setChoiceModal(true);
    quickMode = false;
    document.documentElement.classList.remove("leto-sticker-mode");
    updateExportButtonForMode();
    return true;
  }

  function resetStory() {
    state = defaultState();
    history.length = 0;
    histIdx = -1;
    applyAll();
    pushHistory();
    save();
    letoToast("Жаңа Story басталды");
  }

  let entryFontApplied = false;
  async function applyEntryFont(tries = 0) {
    if (entryFontApplied) return;
    const raw = new URLSearchParams(location.search).get("font");
    if (!raw) return;
    const key = decodeURIComponent(raw).trim().toLowerCase();
    try {
      const rows = FONT_DATA || (await loadFontData());
      const rec = (rows || []).find((row) =>
        [row.name, row.slug, row.family].some((v) => String(v || "").toLowerCase() === key)
      );
      if (!rec) return;
      if (!window.__qaripGesture) {
        if (tries < 24) setTimeout(() => applyEntryFont(tries + 1), 120);
        return;
      }
      await window.Qarip?.loadFamily?.(rec.family || rec.name, rec.preview || "");
      entryFontApplied = !!window.__qaripGesture.applyFont(rec.family || rec.name, rec.name, "regular");
      if (entryFontApplied) {
        state.lastFontName = rec.name;
        letoToast(`${rec.name} қарпі қолданылды`);
        openSheet("fonts");
      } else if (tries < 24) {
        setTimeout(() => applyEntryFont(tries + 1), 120);
      }
    } catch {
      letoToast("Қаріп жүктелмеді. Қаріп мәзірінен қайта таңдаңыз.");
    }
  }

  function enterChoice(mode) {
    const choice = qs(".leto-choice");
    setChoiceModal(false);
    applyEntryFont();
    quickMode = mode === "sticker";
    document.documentElement.classList.toggle("leto-sticker-mode", quickMode);
    updateExportButtonForMode();
    if (choice) {
      choice.classList.add("done");
      choice.setAttribute("hidden", "");
      choice.setAttribute("aria-hidden", "true");
    }
    if (!quickMode) {
      qs(".leto-export")?.focus();
      if (!new URLSearchParams(location.search).get("font")) maybeOnboard();
    }
    if (quickMode) {
      state.bg = { ...state.bg, type: "transparent", value: "" };
      applyBackground();
      setBgEdit(false);
      showTextbar();
      openSheet("text");
    }
  }

  function renderChoiceHome() {
    return `
      <button type="button" class="leto-choice-back" data-choice-back aria-label="Артқа"></button>
      <div class="leto-choice-head">
        <p class="leto-choice-eyebrow">ТАҢБА STORIES</p>
        <h1>Story жасауды бастаңыз</h1>
        <p class="leto-choice-sub">Instagram Stories үшін қазақша қаріптермен әдемі дизайн жасаңыз.</p>
      </div>
      <ol class="leto-choice-steps">
        <li><b>1</b> Фон таңдаңыз</li>
        <li><b>2</b> Мәтін жазыңыз</li>
        <li><b>3</b> Қаріп таңдаңыз</li>
        <li><b>4</b> Story-ді жүктеңіз</li>
      </ol>
      <button type="button" class="leto-choice-start" data-choice="editor">Story жасау</button>
      <button type="button" class="leto-choice-alt" data-choice="sticker">Мәтінді қаріппен көшіру</button>
    `;
  }

  function ensureChoice() {
    let choice = qs(".leto-choice");
    if (choice) {
      if (!choice.dataset.bound) bindChoice(choice);
      markLetoReady();
      return choice;
    }
    choice = document.createElement("div");
    choice.className = "leto-choice";
    choice.setAttribute("role", "dialog");
    choice.setAttribute("aria-modal", "true");
    choice.setAttribute("aria-label", "Stories режимін таңдау");
    choice.innerHTML = renderChoiceHome();
    document.body.append(choice);
    bindChoice(choice);
    setChoiceModal(true);
    markLetoReady();
    return choice;
  }

  function bindChoice(choice) {
    if (!choice || choice.dataset.bound === "1") return;
    choice.dataset.bound = "1";
    new MutationObserver(() => {
      if (choice.hidden || choice.classList.contains("done")) return;
      [...document.body.children].forEach(el => {
        if (el === choice || /^(SCRIPT|STYLE)$/.test(el.tagName)) return;
        if (!choiceInert.has(el)) choiceInert.set(el, el.hasAttribute("inert"));
        el.setAttribute("inert", "");
      });
    }).observe(document.body, { childList: true });
    choice.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const buttons = [...choice.querySelectorAll("button")];
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    choice.addEventListener(
      "click",
      (e) => {
        if (e.target.closest("[data-choice-back]")) {
          e.preventDefault();
          location.href = "/tanba/";
          return;
        }
        const editorBtn = e.target.closest('[data-choice="editor"]');
        if (editorBtn) {
          e.preventDefault();
          enterChoice("editor");
          return;
        }
        const stickerBtn = e.target.closest('[data-choice="sticker"]');
        if (stickerBtn) {
          e.preventDefault();
          enterChoice("sticker");
        }
      },
      true
    );
  }

  function markLetoReady() {
    document.documentElement.classList.add("leto-ready");
  }

  function syncLegacyPairButtons() {
    const rewrites = [
      {
        needle: "Unbounded",
        html: '<span>07</span><b><i style="font-family:&quot;Forum&quot;, serif">Forum</i> × <em style="font-family:&quot;Oswald&quot;, sans-serif;font-weight:700">Oswald</em></b>',
      },
      {
        needle: "Russo",
        html: '<span>06</span><b><i style="font-family:&quot;Rubik&quot;, sans-serif;font-weight:700">Rubik</i> × <em style="font-family:&quot;Inter&quot;, sans-serif;font-weight:800">Inter</em></b>',
      },
    ];
    qsa(".reels-options:not(.reels-colors) > button").forEach((btn) => {
      const text = btn.textContent || "";
      const hit = rewrites.find((r) => text.includes(r.needle));
      if (hit) btn.innerHTML = hit.html;
    });
  }

  function boot() {
    syncLegacyPairButtons();
    ensureStyleLink();
    const nodes = ensureShell();
    if (!nodes?.preview) return;
    ensureBg(nodes.preview);
    ensureLogo(nodes.preview);
    applyAll();
    if (nodes.preview.dataset.bgResize !== "1") {
      nodes.preview.dataset.bgResize = "1";
      new ResizeObserver(() => {
        const img = qs(".stories-bg-photo", nodes.preview);
        if (img && !img.hidden) sizeBgPhoto(img);
      }).observe(nodes.preview);
    }
    if (!history.length) pushHistory();
    ensureChoice();
    const params = new URLSearchParams(location.search);
    if (params.get("font") || params.get("start") === "1") enterChoice("editor");
    bindEditorKeys();
    markLetoReady();
    loadFontData().then(() => {
      if (activeSheet === "fonts") renderSheet("fonts");
    });

    if (nodes.preview.dataset.letoObs !== "1") {
      nodes.preview.dataset.letoObs = "1";
      let t = 0;
      new MutationObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => {
          ensureBg(nodes.preview);
          ensureLogo(nodes.preview);
          applyBackground();
          applyLogo();
          applyLayout();
          paintStickers();
        }, 50);
      }).observe(nodes.preview, { childList: true, subtree: true });
    }
  }

  // Defense-in-depth: physically remove legacy homepage chrome from the DOM (not just
  // hide it) so it can never flash on screen, even for a frame, regardless of CSS timing.
  // Runs immediately and re-applies on every DOM change.
  const LEGACY_HIDE_SELECTORS = [
    ".intro",
    "#tester",
    "#about",
    ".qarip-landing",
    ".stories-promo",
    ".topbar",
    ".stories-page-hero",
    "footer",
    ".reels-copy",
  ];
  function hideLegacyChrome() {
    LEGACY_HIDE_SELECTORS.forEach((sel) => {
      qsa(sel).forEach((el) => {
        // Fully remove purely decorative legacy nodes instead of just hiding them —
        // guarantees they can never flash on screen, on any device/network speed.
        el.remove();
      });
    });
    // #catalog is only hidden, not removed — legacy font-list fallback still reads its cards.
    const catalog = qs("#catalog");
    if (catalog && catalog.style.display !== "none") catalog.style.setProperty("display", "none", "important");
  }

  function start() {
    loadFontData();
    hideLegacyChrome();
    ensureChoice();
    markLetoReady();
    let n = 0;
    const tick = () => {
      hideLegacyChrome();
      const previewReady = qs(".phone-preview");
      const engineReady = qs(".reels-controls") || qs(".subtitle-stack");
      if (previewReady && (engineReady || n > 45)) {
        boot();
        return;
      }
      if (++n < 180) requestAnimationFrame(tick);
    };
    tick();
    if (!start.observed) {
      start.observed = true;
      let hideT = 0;
      new MutationObserver((mutations) => {
        const touched = mutations.some((m) =>
          [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches?.(LEGACY_HIDE_SELECTORS.join(",")) || n.querySelector?.(LEGACY_HIDE_SELECTORS.join(","))))
        );
        if (!touched) return;
        clearTimeout(hideT);
        hideT = setTimeout(hideLegacyChrome, 60);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  ensureStyleLink();
  hideLegacyChrome();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("load", () => setTimeout(start, 100));
})();
