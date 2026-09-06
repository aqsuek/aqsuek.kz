(() => {
  const HOME_TITLE = "Qarip — қазақша Stories және қаріптер";
  const HOME_DESC =
    "Қазақша Stories үшін дайын мәтін стильдерін жасаңыз және қазақ әріптерін қолдайтын қаріптерді онлайн тексеріп, жүктеңіз.";
  const STORIES_TITLE = "Қазақша Stories мәтін генераторы | Qarip";
  const STORIES_DESC =
    "Қазақша Stories үшін қаріп комбинациясын таңдаңыз, мәтінді өңдеңіз және дайын 9:16 PNG жүктеп алыңыз.";
  const DISCLAIMER =
    "Qarip қаріптердің қазақ әліпбиін қолдауын тексеруге және оларды табуды жеңілдетуге арналған. Қаріптердің авторлық құқықтары тиісті құқық иелеріне тиесілі. Коммерциялық қолданар алдында әр қаріптің лицензия шарттарын тексеріңіз.";

  const STYLE_PREVIEWS = [
    { name: "Playfair × Montserrat", hook: "әдемі", mark: "Stories", hookFamily: '"Playfair Display", serif', hookStyle: "italic", markFamily: "Montserrat, sans-serif", bg: "#2b2724" },
    { name: "Prata × Gilroy", hook: "Luxury", mark: "editorial", hookFamily: "Prata, serif", hookStyle: "normal", markFamily: "Montserrat, sans-serif", bg: "#3a2a24" },
    { name: "Oswald × Onest", hook: "ҚАЗАҚША", mark: "2026", hookFamily: "Oswald, sans-serif", hookStyle: "normal", markFamily: "Onest, sans-serif", bg: "#243028", upper: true },
    { name: "Yeseva × Manrope", hook: "Display", mark: "clean", hookFamily: '"Yeseva One", serif', hookStyle: "normal", markFamily: "Manrope, sans-serif", bg: "#2a2434" },
    { name: "Cormorant × Gotham", hook: "fashion", mark: "look", hookFamily: '"Cormorant Garamond", serif', hookStyle: "italic", markFamily: "Montserrat, sans-serif", bg: "#322428" },
    { name: "Russo × Inter", hook: "ENERGY", mark: "vlog", hookFamily: '"Russo One", sans-serif', hookStyle: "normal", markFamily: "Inter, sans-serif", bg: "#26262a", upper: true },
    { name: "Unbounded × Oswald", hook: "9:16", mark: "PNG", hookFamily: "Unbounded, sans-serif", hookStyle: "normal", markFamily: "Oswald, sans-serif", bg: "#1e2c24" },
  ];

  const READY = "v2";
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
    document.documentElement.classList.add("qarip-v2");
  }

  function fontCount() {
    const count = document.querySelector(".workspace-heading .count");
    const match = count?.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) return match[2];
    const cards = document.querySelectorAll(".font-grid > .font-card").length;
    return cards ? String(cards) : "";
  }

  function storyHTML(item, extraClass = "") {
    const hookClass = item.upper ? "is-upper" : "";
    return `<a class="qarip-story ${extraClass}" href="/qarip/stories/" style="--story-bg:${item.bg}">
      <strong class="${hookClass}" style="font-family:${item.hookFamily};font-style:${item.hookStyle}">${item.hook}</strong>
      <span style="font-family:${item.markFamily}">${item.mark}</span>
      <em>${item.name}</em>
    </a>`;
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
        link.classList.add("qarip-nav-optional");
        return;
      }
      if (label === "Жоба туралы") {
        link.setAttribute("href", isStoriesPage() ? "/qarip/#about" : "#about");
      }
    });
    const brand = document.querySelector(".topbar .brand");
    if (brand) brand.setAttribute("href", isStoriesPage() ? "/qarip/" : "#top");

    const topbar = document.querySelector(".topbar");
    if (!topbar || topbar.dataset.v2Nav === "1") return;
    topbar.dataset.v2Nav = "1";

    let actions = topbar.querySelector(".qarip-nav-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "qarip-nav-actions";
      topbar.append(actions);
    }
    if (!actions.querySelector(".qarip-nav-search")) {
      const search = document.createElement("a");
      search.className = "qarip-nav-search";
      search.href = isStoriesPage() ? "/qarip/#catalog" : "#catalog";
      search.setAttribute("aria-label", "Қаріптерді іздеу");
      search.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
      actions.append(search);
    }
    if (!actions.querySelector(".qarip-nav-toggle")) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "qarip-nav-toggle";
      toggle.setAttribute("aria-label", "Мәзір");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = `<span></span><span></span><span></span>`;
      toggle.addEventListener("click", () => {
        const open = document.documentElement.classList.toggle("qarip-nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      actions.append(toggle);
    }
    topbar.querySelector("nav")?.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element) || !event.target.closest("a")) return;
        document.documentElement.classList.remove("qarip-nav-open");
        actions.querySelector(".qarip-nav-toggle")?.setAttribute("aria-expanded", "false");
      },
      { once: false }
    );
  }

  function setMeta(title, desc, canonical) {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.append(tag);
    }
    tag.setAttribute("content", desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.append(canon);
    }
    canon.href = canonical;
  }

  function polishHomeHero() {
    if (isStoriesPage()) return;
    const intro = document.querySelector(".intro");
    if (!intro) return;
    intro.classList.add("qarip-hero");
    intro.classList.remove("qarip-hero-legacy");

    let copy = intro.querySelector(".qarip-hero-copy");
    if (!copy) {
      copy = document.createElement("div");
      copy.className = "qarip-hero-copy";
      intro.prepend(copy);
    }
    [...intro.children].forEach((child) => {
      if (child === copy || child.classList.contains("alphabet") || child.classList.contains("qarip-hero-visual")) return;
      copy.append(child);
    });

    const eyebrow = copy.querySelector(".eyebrow");
    if (eyebrow) {
      eyebrow.replaceChildren();
      eyebrow.classList.add("qarip-hero-label");
      eyebrow.textContent = "ҚАЗАҚША МӘТІН. ӘДЕМІ STORIES. ОҢАЙ.";
    }

    const h1 = copy.querySelector("h1");
    if (h1) {
      h1.innerHTML = `Қазақша<br>Stories-ты<br><span class="qarip-accent">әдемі</span> жасаңыз`;
    }

    const desc = copy.querySelector(":scope > p:not(.qarip-trust):not(.qarip-hero-glyphs):not(.qarip-features)");
    if (desc && !desc.classList.contains("qarip-hero-desc")) {
      desc.className = "qarip-hero-desc";
      desc.textContent = "Мәтінді жазыңыз, стиль таңдаңыз және дайын 9:16 PNG жүктеп алыңыз.";
    }

    const row = copy.querySelector(".intro-cta-row");
    if (row) {
      row.innerHTML = `
        <a class="intro-cta qarip-cta-primary" href="/qarip/stories/">Stories жасап көру →</a>
        <a class="qarip-cta-secondary" href="#catalog">Қаріптерді көру</a>
      `;
    }

    copy.querySelector(".qarip-trust")?.remove();

    let glyphs = copy.querySelector(".qarip-hero-glyphs");
    if (!glyphs) {
      glyphs = document.createElement("p");
      glyphs.className = "qarip-hero-glyphs";
      glyphs.lang = "kk";
      row?.after(glyphs);
    }
    glyphs.textContent = "Ә Ғ Қ Ң Ө Ұ Ү Һ І";

    let features = copy.querySelector(".qarip-features");
    if (!features) {
      features = document.createElement("ul");
      features.className = "qarip-features";
      glyphs.after(features);
    }
    features.innerHTML = `
      <li><i aria-hidden="true">⚡</i><span>Тез және оңай</span></li>
      <li><i aria-hidden="true">♡</i><span>Қазақша қаріптер</span></li>
      <li><i aria-hidden="true">▣</i><span>Жоғары сапалы PNG</span></li>
    `;

    intro.querySelector(".alphabet")?.setAttribute("hidden", "");

    let visual = intro.querySelector(".qarip-hero-visual");
    if (!visual) {
      visual = document.createElement("div");
      visual.className = "qarip-hero-visual";
      intro.append(visual);
    }
    const heroItems = STYLE_PREVIEWS.slice(0, 3);
    visual.innerHTML = `
      <div class="qarip-hero-stack" aria-hidden="true">
        ${storyHTML(heroItems[1] || heroItems[0], "qarip-story-side qarip-story-left")}
        ${storyHTML(heroItems[0], "qarip-story-main")}
        ${storyHTML(heroItems[2] || heroItems[0], "qarip-story-side qarip-story-right")}
      </div>
      <div class="qarip-hero-mobile-story">
        ${storyHTML(heroItems[0], "qarip-story-main")}
      </div>
    `;
  }

  function ensureLanding() {
    if (isStoriesPage()) {
      document.querySelector(".qarip-landing")?.remove();
      document.querySelector(".stories-promo")?.remove();
      return;
    }
    document.querySelector(".stories-promo")?.remove();
    const intro = document.querySelector(".intro");
    const catalog = document.getElementById("catalog");
    if (!intro || !catalog) return;
    let landing = document.querySelector(".qarip-landing");
    if (!landing) {
      landing = document.createElement("div");
      landing.className = "qarip-landing";
    }
    if (landing.dataset.ready === READY && landing.querySelector("#qarip-how-title")) {
      if (landing.previousElementSibling !== intro) intro.after(landing);
      if (catalog.previousElementSibling !== landing) landing.after(catalog);
      return;
    }

    const n = fontCount();
    landing.innerHTML = `
      <section class="qarip-how" aria-labelledby="qarip-how-title">
        <div class="qarip-section-head">
          <h2 id="qarip-how-title">3 қадамда дайын Stories</h2>
          <p>Жазыңыз → стиль таңдаңыз → PNG алыңыз.</p>
        </div>
        <ol class="qarip-steps">
          <li class="qarip-step">
            <span class="qarip-step-num">1</span>
            <strong>Мәтінді жазыңыз</strong>
            <div class="qarip-step-preview qarip-step-input" aria-hidden="true">
              <span>Қазақша Stories</span>
            </div>
          </li>
          <li class="qarip-step">
            <span class="qarip-step-num">2</span>
            <strong>Стиль таңдаңыз</strong>
            <div class="qarip-step-preview qarip-step-styles" aria-hidden="true">
              <i style="font-family:'Playfair Display',serif;font-style:italic">Aa</i>
              <i style="font-family:Oswald,sans-serif">Aa</i>
              <i style="font-family:'Cormorant Garamond',serif;font-style:italic">Aa</i>
            </div>
          </li>
          <li class="qarip-step">
            <span class="qarip-step-num">3</span>
            <strong>PNG жүктеп алыңыз</strong>
            <div class="qarip-step-preview qarip-step-download" aria-hidden="true">
              <span>Жүктеу ↓</span>
            </div>
          </li>
        </ol>
      </section>

      <section class="qarip-styles" aria-labelledby="qarip-styles-title">
        <div class="qarip-styles-head">
          <div>
            <h2 id="qarip-styles-title">Дайын стильдер</h2>
            <p class="qarip-styles-sub">Оңай, жылдам, әдемі.</p>
          </div>
          <a class="qarip-styles-cta" href="/qarip/stories/">Барлығын көру →</a>
        </div>
        <div class="qarip-style-rail">
          ${STYLE_PREVIEWS.map((item, i) => storyHTML(item, `qarip-style-${i}`)).join("")}
        </div>
      </section>

      <section class="qarip-toolcta" aria-labelledby="qarip-toolcta-title">
        <div class="qarip-toolcta-copy">
          <h2 id="qarip-toolcta-title">Өз идеяларыңызды әдемі етіңіз</h2>
          <p>Қазақша мәтінді жазып, дайын 9:16 PNG алыңыз.${n ? ` ${n} қаріп қолжетімді.` : ""}</p>
        </div>
        <a class="qarip-cta-primary" href="/qarip/stories/">Stories жасап көру →</a>
      </section>
      <div id="pricing-slot" hidden></div>
    `;
    intro.after(landing);
    landing.after(catalog);
    landing.dataset.ready = READY;
  }

  function polishCatalog() {
    if (isStoriesPage()) return;
    const heading = document.querySelector(".workspace-heading h2");
    if (heading) heading.textContent = "Қазақша қаріптер каталогы";
    const wrap = document.querySelector(".workspace-heading > div");
    if (wrap && !wrap.querySelector(".qarip-catalog-lead")) {
      const lead = document.createElement("p");
      lead.className = "qarip-catalog-lead";
      lead.textContent =
        "Қазақ әріптерін қолдайтын қаріптерді тексеріп, өз мәтініңізбен көріп және жүктеп алыңыз.";
      wrap.append(lead);
    }
  }

  function polishGeneratorCopy() {
    const copy = document.querySelector(".reels-copy .section-number");
    if (copy) copy.textContent = "STORIES / 2026";
    const title = document.querySelector(".reels-copy h2");
    if (title && /Субтитр|Reels|REELS/i.test(title.textContent || "")) {
      title.innerHTML = "Stories<br><em>мәтін стильдері</em>";
    }
    document.querySelectorAll(".reel-ui span").forEach((el) => {
      if ((el.textContent || "").trim() === "REELS") el.textContent = "STORIES";
    });
  }

  function ensureStoriesHero() {
    if (!isStoriesPage()) {
      document.querySelector(".stories-page-hero")?.remove();
      return;
    }
    const reels = document.getElementById("reels");
    if (!reels) return;
    let hero = document.querySelector(".stories-page-hero");
    if (!hero) {
      hero = document.createElement("header");
      hero.className = "stories-page-hero";
      reels.parentNode.insertBefore(hero, reels);
    }
    hero.innerHTML = `
      <p class="stories-page-eyebrow">QARIP STORIES</p>
      <h1>Қазақша Stories мәтін генераторы</h1>
      <p>Мәтінді жазыңыз, қаріп комбинациясын таңдаңыз және дайын 9:16 PNG жүктеп алыңыз.</p>
    `;
    setMeta(STORIES_TITLE, STORIES_DESC, "https://aqsuek.kz/qarip/stories/");
  }

  function polishAboutFooter() {
    const aboutH = document.querySelector("#about h2");
    if (aboutH) aboutH.textContent = "Жоба туралы";
    const aboutP = document.querySelector("#about p");
    if (aboutP) aboutP.textContent = DISCLAIMER;
    const footerP = document.querySelector("footer p");
    if (footerP) footerP.textContent = DISCLAIMER;
    const footer = document.querySelector("footer");
    if (footer && !footer.querySelector(".qarip-footer-nav")) {
      const nav = document.createElement("nav");
      nav.className = "qarip-footer-nav";
      nav.setAttribute("aria-label", "Төменгі мәзір");
      nav.innerHTML = `
        <a href="${isStoriesPage() ? "/qarip/#catalog" : "#catalog"}">Қаріптер</a>
        <a href="/qarip/stories/">Stories</a>
        <a href="${isStoriesPage() ? "/qarip/#about" : "#about"}">Жоба туралы</a>
      `;
      footerP?.after(nav);
    }
  }

  function apply() {
    if (redirectLegacy()) return;
    markPage();
    polishNav();
    if (isStoriesPage()) {
      polishGeneratorCopy();
      ensureStoriesHero();
    } else {
      polishHomeHero();
      ensureLanding();
      polishCatalog();
      setMeta(HOME_TITLE, HOME_DESC, "https://aqsuek.kz/qarip/");
    }
    polishAboutFooter();
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

  window.QaripSite = { isStoriesPage, apply, fontCount };

  if (redirectLegacy()) return;
  markPage();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch);
  else watch();
  window.addEventListener("load", () => setTimeout(apply, 80));
})();
