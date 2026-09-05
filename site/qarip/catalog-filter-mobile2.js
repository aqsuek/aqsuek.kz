(() => {
  const ALL = "Барлығы";
  const PAGE_SIZE = 32;
  let visibleLimit = PAGE_SIZE;

  const style = document.createElement("style");
  style.textContent =
    '.font-card[data-filter-hide="1"]{display:none!important}.catalog-more{display:block;width:min(100%,520px);margin:32px auto 0;padding:16px 22px;border:1px solid #1c1c1a;background:#d9ff47;color:#181816;font:700 14px/1.2 Arial,sans-serif;cursor:pointer}.catalog-more:hover{background:#181816;color:#d9ff47}.categories button small{margin-left:5px;opacity:.55;font:inherit}.meta .license-check{color:#8b4a14}.meta .license-open{color:#286332}.font-favorite{border:1px solid #181816;background:transparent;color:#181816;border-radius:99px;width:30px;height:30px;font-size:18px;line-height:1;cursor:pointer}.font-favorite[aria-pressed="true"]{background:#181816;color:#d9ff47}@media(max-width:640px){.catalog-more{margin-top:20px;padding:15px 16px;font-size:13px}}';
  document.head.appendChild(style);

  function activeCategory() {
    const btn = document.querySelector(".categories button.active");
    return (btn && (btn.dataset.category || btn.textContent.trim())) || ALL;
  }

  function query() {
    const input = document.querySelector(".search input");
    return ((input && input.value) || "").trim().toLowerCase();
  }

  function renderMoreButton(matching, total) {
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
    const remaining = matching.length - visibleLimit;
    more.textContent = `Тағы ${Math.min(remaining, PAGE_SIZE)} қаріпті ашу · ${matching.length} / ${total}`;
  }

  function decorateCatalog(cards) {
    const categoryTotals = new Map();
    const seen = new Set();
    cards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent?.trim();
      if (!name || seen.has(name)) return;
      seen.add(name);
      const category = card.querySelector(".meta > span")?.textContent?.trim();
      if (category) categoryTotals.set(category, (categoryTotals.get(category) || 0) + 1);

      const license = card.querySelector(".meta > span:last-child");
      if (!license || license.dataset.labelled) return;
      license.dataset.labelled = "1";
      if (license.textContent.trim() === "OFL") {
        license.textContent = "Ашық лицензия · OFL";
        license.classList.add("license-open");
      } else if (license.textContent.trim() === "Тікелей") {
        license.textContent = "Лицензиясын тексеру";
        license.classList.add("license-check");
      }

      const glyphStatus = card.querySelector(".meta > span:nth-child(2)");
      if (glyphStatus?.textContent.trim() === "Жүктелген файл") {
        glyphStatus.textContent = "Кодтауды тексеру";
        glyphStatus.classList.add("license-check");
      }
    });

    document.querySelectorAll(".categories button").forEach((button) => {
      const category = button.dataset.category || button.textContent.trim();
      button.dataset.category = category;
      const total = category === ALL ? seen.size : categoryTotals.get(category) || 0;
      if (!button.querySelector("small")) {
        const count = document.createElement("small");
        count.textContent = total;
        button.appendChild(count);
      }
    });
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
      if (matchCat && matchQ && !duplicate) matching.push(card);
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
      count.textContent = `${Math.min(matching.length, visibleLimit)} / ${seen.size || cards.length} қаріп`;
    }
    renderMoreButton(matching, seen.size || cards.length);
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
      schedule(btn.dataset.category || btn.textContent.trim());
    },
    true
  );

  document.addEventListener("input", (event) => {
    if (event.target.closest(".search input")) apply(undefined, true);
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
    }, 220);
  });
})();
