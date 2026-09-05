(() => {
  const ALL = "Барлығы";
  const PAGE_SIZE = 32;
  const KZ_GLYPHS = ["Ә", "Ғ", "Қ", "Ң", "Ө", "Ұ", "Ү", "Һ"];
  let visibleLimit = PAGE_SIZE;
  let oflOnly = false;

  const style = document.createElement("style");
  style.textContent =
    '.font-card[data-filter-hide="1"]{display:none!important}.catalog-more{display:block;width:min(100%,520px);margin:32px auto 0;padding:16px 22px;border:1px solid #1c1c1a;background:#d9ff47;color:#181816;font:700 14px/1.2 Arial,sans-serif;cursor:pointer}.catalog-more:hover{background:#181816;color:#d9ff47}.categories button small{margin-left:5px;opacity:.55;font:inherit}.meta .license-check{color:#8b4a14}.meta .license-open{color:#286332}.font-favorite{border:1px solid #181816;background:transparent;color:#181816;border-radius:99px;width:30px;height:30px;font-size:18px;line-height:1;cursor:pointer}.font-favorite[aria-pressed="true"]{background:#181816;color:#d9ff47}.categories button.license-filter{border:1px solid #286332;color:#286332}.categories button.license-filter[aria-pressed="true"]{background:#286332;color:#fff}.intro-cta-row{position:relative;z-index:2;margin-top:22px}.intro-cta{display:inline-flex;align-items:center;padding:14px 22px;border:1px solid #181816;border-radius:999px;background:#181816;color:#d9ff47;font:800 14px/1 Arial,sans-serif;letter-spacing:.03em;text-decoration:none}.intro-cta:hover{background:#d9ff47;color:#181816}html{scroll-padding-top:16px}@media(max-width:900px){.topbar{height:auto!important;min-height:76px;padding-top:12px;padding-bottom:12px;grid-template-columns:1fr auto;grid-template-areas:"brand social" "nav nav";row-gap:8px}.topbar .brand{grid-area:brand}.topbar .header-end{grid-area:social}.topbar nav{grid-area:nav;display:flex!important;flex-wrap:wrap;gap:10px 16px;font-size:13px}.intro-cta{min-height:44px}}@media(max-width:640px){.catalog-more{margin-top:20px;padding:15px 16px;font-size:13px}}';
  document.head.appendChild(style);

  function activeCategory() {
    const btn = document.querySelector(".categories button.active:not(.license-filter)");
    return (btn && (btn.dataset.category || btn.textContent.trim())) || ALL;
  }

  function query() {
    const input = document.querySelector(".search input");
    return ((input && input.value) || "").trim().toLowerCase();
  }

  function renderMoreButton(matching) {
    let more = document.querySelector(".catalog-more");
    if (matching.length <= visibleLimit) {
      more?.remove();
      return;
    }
    if (!more) {
      more = document.createElement("button");
      more.type = "button";
      more.className = "catalog-more";
      more.addEventListener("click", () => {
        visibleLimit += PAGE_SIZE;
        apply();
      });
      document.querySelector(".font-grid")?.after(more);
    }
    const shown = Math.min(matching.length, visibleLimit);
    const remaining = matching.length - shown;
    more.textContent = `Тағы ${Math.min(remaining, PAGE_SIZE)} қаріпті ашу · ${shown} / ${matching.length}`;
  }

  function kazakhGlyphsMissing(family) {
    if (!family) return false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.font = `72px ${family}`;
    const tofu = ctx.measureText("\uFFFF").width;
    const tofu2 = ctx.measureText("\uFFFE").width;
    let missing = 0;
    for (const ch of KZ_GLYPHS) {
      const width = ctx.measureText(ch).width;
      if (width === 0 || Math.abs(width - tofu) < 0.6 || Math.abs(width - tofu2) < 0.6) missing += 1;
    }
    return missing >= 2;
  }

  function labelGlyphStatus(card) {
    const glyphStatus = card.querySelector(".meta > span:nth-child(2)");
    if (!glyphStatus || glyphStatus.dataset.glyphChecked === "1") return;
    const raw = glyphStatus.textContent.replace(/\s+/g, " ").trim();
    if (raw !== "Жүктелген файл" && !raw.includes("Кодтауды тексеру")) return;
    glyphStatus.dataset.glyphChecked = "1";
    const family = card.querySelector(".font-preview")?.style.fontFamily || "";
    if (kazakhGlyphsMissing(family)) {
      glyphStatus.hidden = false;
      glyphStatus.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = "Кодтауды тексеру";
      });
      if (!/Кодтауды тексеру/.test(glyphStatus.textContent)) {
        glyphStatus.append("Кодтауды тексеру");
      }
      glyphStatus.classList.add("license-check");
    } else {
      glyphStatus.hidden = true;
      glyphStatus.classList.remove("license-check");
    }
  }

  function ensureOflButton() {
    const row = document.querySelector(".categories");
    if (!row || row.querySelector(".license-filter")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "license-filter";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = 'Ашық · OFL<small>0</small>';
    const first = row.querySelector("button");
    if (first?.nextSibling) row.insertBefore(button, first.nextSibling);
    else row.append(button);
  }

  function decorateCatalog(cards) {
    const categoryTotals = new Map();
    const seen = new Set();
    let oflCount = 0;
    cards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.trim();
      if (!name || seen.has(name)) return;
      seen.add(name);
      const category = card.querySelector(".meta > span")?.textContent?.trim();
      if (category) categoryTotals.set(category, (categoryTotals.get(category) || 0) + 1);

      const license = card.querySelector(".meta > span:last-child");
      if (license && !license.dataset.labelled) {
        license.dataset.labelled = "1";
        if (license.textContent.trim() === "OFL") {
          license.textContent = "Ашық лицензия · OFL";
          license.classList.add("license-open");
        } else if (license.textContent.trim() === "Тікелей") {
          license.textContent = "Лицензиясын тексеру";
          license.classList.add("license-check");
        }
      }
      if (card.querySelector(".license-open")) oflCount += 1;
      labelGlyphStatus(card);
    });

    ensureOflButton();
    document.querySelectorAll(".categories button:not(.license-filter)").forEach((button) => {
      const category = button.dataset.category || button.textContent.trim();
      button.dataset.category = category;
      const total = category === ALL ? seen.size : categoryTotals.get(category) || 0;
      if (!button.querySelector("small")) {
        const count = document.createElement("small");
        count.textContent = total;
        button.appendChild(count);
      }
    });
    const oflSmall = document.querySelector(".license-filter small");
    if (oflSmall) oflSmall.textContent = String(oflCount);
  }

  function addFavorites(cards) {
    let saved;
    try {
      saved = new Set(JSON.parse(localStorage.getItem("qarip-favorites") || "[]"));
    } catch {
      saved = new Set();
    }
    cards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.trim();
      const top = card.querySelector(".card-top");
      if (!name || !top || top.querySelector(".font-favorite")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "font-favorite";
      button.title = "Таңдаулыға сақтау";
      button.setAttribute("aria-label", `${name} қаріпін таңдаулыға сақтау`);
      button.setAttribute("aria-pressed", String(saved.has(name)));
      button.textContent = saved.has(name) ? "♥" : "♡";
      button.addEventListener("click", () => {
        if (saved.has(name)) saved.delete(name);
        else saved.add(name);
        localStorage.setItem("qarip-favorites", JSON.stringify([...saved]));
        button.setAttribute("aria-pressed", String(saved.has(name)));
        button.textContent = saved.has(name) ? "♥" : "♡";
      });
      top.append(button);
    });
  }

  function apply(forcedCat, resetLimit = false) {
    if (resetLimit) visibleLimit = PAGE_SIZE;
    const cat = forcedCat || activeCategory();
    const q = query();
    const grid = document.querySelector(".font-grid");
    if (!grid) return;
    const cards = grid.querySelectorAll(":scope > .font-card");
    const seen = new Set();
    const matching = [];
    cards.forEach((card) => {
      const name = (card.querySelector("h3")?.textContent || "").trim();
      const maker = (card.querySelector(".card-top p")?.textContent || "").trim();
      const fontStyle = (
        card.querySelector(".meta > span")?.textContent || ""
      ).trim();
      const duplicate = name !== "" && seen.has(name);
      if (name) seen.add(name);
      const matchCat = cat === ALL || fontStyle === cat;
      const matchQ = !q || `${name} ${maker}`.toLowerCase().includes(q);
      const matchOfl = !oflOnly || !!card.querySelector(".license-open");
      if (matchCat && matchQ && matchOfl && !duplicate) matching.push(card);
    });

    const shownCards = new Set(matching.slice(0, visibleLimit));
    cards.forEach((card) => {
      const show = shownCards.has(card);
      if (show) {
        card.removeAttribute("data-filter-hide");
        card.style.removeProperty("display");
      } else {
        card.setAttribute("data-filter-hide", "1");
        card.style.display = "none";
      }
    });
    const count = document.querySelector(".workspace-heading .count");
    if (count) {
      count.textContent = `${Math.min(matching.length, visibleLimit)} / ${matching.length} қаріп`;
    }
    renderMoreButton(matching);
  }

  function schedule(cat) {
    apply(cat, true);
    requestAnimationFrame(() => apply(cat));
    setTimeout(() => apply(cat), 40);
    setTimeout(() => apply(), 120);
  }

  document.addEventListener(
    "click",
    (event) => {
      const btn = event.target.closest(".categories button");
      if (!btn) return;
      if (btn.classList.contains("license-filter")) {
        oflOnly = !oflOnly;
        btn.setAttribute("aria-pressed", String(oflOnly));
        apply(undefined, true);
        return;
      }
      schedule(btn.dataset.category || btn.textContent.trim());
    },
    true
  );

  document.addEventListener("input", (event) => {
    if (event.target.closest(".search input")) apply(undefined, true);
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.target === "_blank") return;
    const id = (link.getAttribute("href") || "").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  });

  function start() {
    const grid = document.querySelector(".font-grid");
    if (!grid || grid.dataset.filterObserved === "1") return;
    grid.dataset.filterObserved = "1";
    decorateCatalog(grid.querySelectorAll(":scope > .font-card"));
    addFavorites(grid.querySelectorAll(":scope > .font-card"));
    apply();
    let timer = 0;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => apply(), 0);
    }).observe(grid, { childList: true });
  }

  function refreshGlyphs() {
    const grid = document.querySelector(".font-grid");
    if (!grid) return;
    grid.querySelectorAll(":scope > .font-card .meta > span:nth-child(2)").forEach((span) => {
      delete span.dataset.glyphChecked;
    });
    decorateCatalog(grid.querySelectorAll(":scope > .font-card"));
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", () => {
    setTimeout(() => {
      const grid = document.querySelector(".font-grid");
      if (!grid) return;
      const cards = grid.querySelectorAll(":scope > .font-card");
      decorateCatalog(cards);
      addFavorites(cards);
      apply();
      const ready = document.fonts?.ready;
      if (ready && typeof ready.then === "function") ready.then(() => setTimeout(refreshGlyphs, 50));
      else setTimeout(refreshGlyphs, 400);
    }, 220);
  });
})();
