(() => {
  const STORIES_TITLE = "Қазақша Stories мәтін генераторы | Qarip";
  let timer = 0;

  function isStoriesPage() {
    return /\/qarip\/stories\/?$/.test(location.pathname);
  }

  function isLegacyReelsPage() {
    return /\/qarip\/reels\/?$/.test(location.pathname);
  }

  function redirectLegacy() {
    if (isLegacyReelsPage()) {
      location.replace("/qarip/stories/");
      return true;
    }
    if (!isStoriesPage() && location.hash === "#reels") {
      location.replace("/qarip/stories/");
      return true;
    }
    return false;
  }

  function markPage() {
    document.documentElement.classList.toggle("qarip-stories", isStoriesPage());
    document.documentElement.classList.toggle("qarip-home", !isStoriesPage());
  }

  function polishNav() {
    document.querySelectorAll(".topbar nav a").forEach((link) => {
      const label = (link.textContent || "").replace(/\s+/g, " ").trim();
      const href = link.getAttribute("href") || "";
      if (label === "Reels" || label === "Reels беті" || href === "#reels" || /\/qarip\/reels\/?$/.test(href)) {
        link.textContent = "Stories";
        link.setAttribute("href", "/qarip/stories/");
        return;
      }
      if (label === "Қаріптер") {
        link.setAttribute("href", isStoriesPage() ? "/qarip/#catalog" : "#catalog");
        return;
      }
      if (label === "Онлайн тексеру") {
        link.setAttribute("href", isStoriesPage() ? "/qarip/#tester" : "#tester");
        return;
      }
      if (label === "Жоба туралы") {
        link.setAttribute("href", isStoriesPage() ? "#about" : "#about");
      }
    });
    const brand = document.querySelector(".topbar .brand");
    if (brand) brand.setAttribute("href", isStoriesPage() ? "/qarip/" : "#top");
  }

  function polishHomeHero() {
    if (isStoriesPage()) return;
    const h1 = document.querySelector(".intro h1");
    if (!h1) return;
    const text = (h1.textContent || "").replace(/\s+/g, " ").trim();
    if (text !== "Қазақша қаріптер") h1.textContent = "Қазақша қаріптер";
  }

  function placePromo(promo) {
    const intro = document.querySelector(".intro");
    if (intro?.parentNode) {
      intro.after(promo);
      return;
    }
    const catalog = document.getElementById("catalog");
    if (catalog?.parentNode) catalog.before(promo);
  }

  function ensurePromo() {
    if (isStoriesPage()) return;
    let promo = document.querySelector(".stories-promo");
    if (!promo) {
      promo = document.createElement("section");
      promo.className = "stories-promo";
      promo.id = "stories-promo";
      promo.innerHTML = `
      <div class="stories-promo-copy">
        <h2>Stories үшін қазақша мәтін жасаңыз</h2>
        <p>Қаріп комбинациясын таңдаңыз, мәтініңізді енгізіңіз және дайын 9:16 PNG жүктеп алыңыз.</p>
        <a class="stories-promo-cta" href="/qarip/stories/">Stories құралын ашу →</a>
        <a class="stories-promo-fonts" href="/qarip/?group=stories#catalog">Әдемі Stories қаріптері</a>
      </div>
      <div class="stories-promo-phones" aria-hidden="true">
        <a class="stories-mini stories-mini-a" href="/qarip/stories/">
          <strong>субтитрге</strong><span>қай қаріп?</span>
        </a>
        <a class="stories-mini stories-mini-b" href="/qarip/stories/">
          <strong>Қазақша</strong><span>Stories</span>
        </a>
        <a class="stories-mini stories-mini-c" href="/qarip/stories/">
          <strong>9:16</strong><span>PNG</span>
        </a>
      </div>
    `;
    }
    placePromo(promo);
  }

  function ensureStoriesHero() {
    if (!isStoriesPage()) return;
    const reels = document.getElementById("reels");
    if (!reels) return;
    let hero = document.querySelector(".stories-page-hero");
    if (!hero) {
      hero = document.createElement("header");
      hero.className = "stories-page-hero";
      hero.innerHTML = `
        <h1>Қазақша Stories мәтін генераторы</h1>
        <p>Stories үшін әдемі қаріп комбинациясын таңдаңыз, мәтінді реттеңіз және дайын 9:16 PNG жүктеп алыңыз.</p>
        <p class="stories-page-note">Instagram Stories, video cover және 9:16 дизайнға арналған.</p>
      `;
      reels.parentNode.insertBefore(hero, reels);
    }
    document.title = STORIES_TITLE;
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.append(canon);
    }
    canon.href = "https://aqsuek.kz/qarip/stories/";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "Қазақша Stories үшін қаріп комбинациясын таңдаңыз, мәтінді өңдеңіз және дайын 9:16 PNG жүктеп алыңыз."
      );
    }
  }

  function apply() {
    if (redirectLegacy()) return;
    markPage();
    polishNav();
    polishHomeHero();
    ensurePromo();
    ensureStoriesHero();
  }

  function watch() {
    apply();
    const topbar = document.querySelector(".topbar");
    if (topbar) {
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(apply, 40);
      }).observe(topbar, { childList: true, subtree: true });
    }
    if (isStoriesPage()) {
      new MutationObserver(() => {
        if (document.title !== STORIES_TITLE) document.title = STORIES_TITLE;
      }).observe(document.head, { childList: true, subtree: true });
    }
    const main = document.querySelector("main");
    if (main) {
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(apply, 40);
      }).observe(main, { childList: true });
    }
  }

  window.QaripSite = { isStoriesPage, apply };

  if (redirectLegacy()) return;
  markPage();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch);
  else watch();
  window.addEventListener("load", () => setTimeout(apply, 80));
})();
