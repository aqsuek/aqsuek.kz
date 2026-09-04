(() => {
  const ALL = "Барлығы";

  const style = document.createElement("style");
  style.textContent =
    '.font-card[data-filter-hide="1"]{display:none!important}';
  document.head.appendChild(style);

  function activeCategory() {
    const btn = document.querySelector(".categories button.active");
    return (btn && btn.textContent.trim()) || ALL;
  }

  function query() {
    const input = document.querySelector(".search input");
    return ((input && input.value) || "").trim().toLowerCase();
  }

  function apply(forcedCat) {
    const cat = forcedCat || activeCategory();
    const q = query();
    const grid = document.querySelector(".font-grid");
    if (!grid) return;
    const cards = grid.querySelectorAll(":scope > .font-card");
    const seen = new Set();
    let shown = 0;
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
      const show = matchCat && matchQ && !duplicate;
      if (show) {
        card.removeAttribute("data-filter-hide");
        card.style.removeProperty("display");
        shown += 1;
      } else {
        card.setAttribute("data-filter-hide", "1");
        card.style.display = "none";
      }
    });
    const count = document.querySelector(".workspace-heading .count");
    if (count) {
      count.textContent = `${shown} / ${seen.size || cards.length} қаріп`;
    }
  }

  function schedule(cat) {
    apply(cat);
    requestAnimationFrame(() => apply(cat));
    setTimeout(() => apply(cat), 40);
    setTimeout(() => apply(), 120);
  }

  document.addEventListener(
    "click",
    (event) => {
      const btn = event.target.closest(".categories button");
      if (!btn) return;
      schedule(btn.textContent.trim());
    },
    true
  );

  document.addEventListener("input", (event) => {
    if (event.target.closest(".search input")) apply();
  });

  function start() {
    apply();
    const grid = document.querySelector(".font-grid");
    if (!grid || grid.dataset.filterObserved === "1") return;
    grid.dataset.filterObserved = "1";
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
  window.addEventListener("load", () => setTimeout(apply, 80));
})();
