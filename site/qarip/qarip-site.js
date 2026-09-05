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
    { name: "Playfair × Montserrat", hook: "әдемі", mark: "Stories", hookFamily: '"Playfair Display", serif', hookStyle: "italic", markFamily: "Montserrat, sans-serif", bg: "#17171c" },
    { name: "Prata × Gilroy", hook: "Luxury", mark: "editorial", hookFamily: "Prata, serif", hookStyle: "normal", markFamily: "Montserrat, sans-serif", bg: "#241816" },
    { name: "Oswald × Onest", hook: "ҚАЗАҚША", mark: "2026", hookFamily: "Oswald, sans-serif", hookStyle: "normal", markFamily: "Onest, sans-serif", bg: "#1a2218", upper: true },
    { name: "Yeseva × Manrope", hook: "Display", mark: "clean", hookFamily: '"Yeseva One", serif', hookStyle: "normal", markFamily: "Manrope, sans-serif", bg: "#1c1824" },
    { name: "Cormorant × Gotham", hook: "fashion", mark: "look", hookFamily: '"Cormorant Garamond", serif', hookStyle: "italic", markFamily: "Montserrat, sans-serif", bg: "#22181a" },
    { name: "Russo × Inter", hook: "ENERGY", mark: "vlog", hookFamily: '"Russo One", sans-serif', hookStyle: "normal", markFamily: "Inter, sans-serif", bg: "#18181a", upper: true },
    { name: "Unbounded × Oswald", hook: "9:16", mark: "PNG", hookFamily: "Unbounded, sans-serif", hookStyle: "normal", markFamily: "Oswald, sans-serif", bg: "#102018" },
  ];

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

  function fontCount() {
    const count = document.querySelector(".workspace-heading .count");
    const match = count?.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) return match[2];
    const cards = document.querySelectorAll(".font-grid > .font-card").length;
    return cards ? String(cards) : "";
  }

  function phoneHTML(item, extraClass = "") {
    const hookClass = item.upper ? "is-upper" : "";
    return `<a class="qarip-phone ${extraClass}" href="/qarip/stories/" style="background:${item.bg}">
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
        return;
      }
      if (label === "Жоба туралы") {
        link.setAttribute("href", isStoriesPage() ? "/qarip/#about" : "#about");
      }
    });
    const brand = document.querySelector(".topbar .brand");
    if (brand) brand.setAttribute("href", isStoriesPage() ? "/qarip/" : "#top");
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
    const eyebrow = intro.querySelector(".eyebrow");
    if (eyebrow) {
      const svg = eyebrow.querySelector("svg");
      eyebrow.replaceChildren();
      if (svg) eyebrow.append(svg);
      eyebrow.append(document.createTextNode(" ҚАЗАҚША STORIES ҚҰРАЛЫ"));
    }
    const h1 = intro.querySelector("h1");
    if (h1 && !h1.querySelector("span")) {
      h1.innerHTML = "Қазақша Stories-ты<br><span>әдемі жасаңыз</span>";
    } else if (h1) {
      h1.innerHTML = "Қазақша Stories-ты<br><span>әдемі жасаңыз</span>";
    }
    const desc = intro.querySelector(":scope > p");
    if (desc) {
      desc.innerHTML =
        "Қазақ әріптерін толық қолдайтын дайын мәтін стильдері мен қаріп комбинациялары.<br>Мәтінді жазыңыз, стиль таңдаңыз және дайын 9:16 PNG жүктеп алыңыз.";
    }
    const row = intro.querySelector(".intro-cta-row");
    if (row) {
      row.innerHTML = `
        <a class="intro-cta qarip-cta-primary" href="/qarip/stories/">Stories жасап көру</a>
        <a class="qarip-cta-secondary" href="#catalog">Қаріптерді көру</a>
      `;
    }
    let trust = intro.querySelector(".qarip-trust");
    if (!trust) {
      trust = document.createElement("p");
      trust.className = "qarip-trust";
      row?.after(trust);
    }
    const n = fontCount();
    trust.textContent = n ? `Қазақша қолдау · ${n} қаріп · 9:16 PNG` : "Қазақша қолдау · 9:16 PNG";
    let copy = intro.querySelector(".qarip-hero-copy");
    if (!copy) {
      copy = document.createElement("div");
      copy.className = "qarip-hero-copy";
      intro.prepend(copy);
    }
    [...intro.children].forEach((child) => {
      if (child === copy || child.classList.contains("alphabet") || child.classList.contains("qarip-hero-phones")) return;
      copy.append(child);
    });
    intro.querySelector(".alphabet")?.setAttribute("hidden", "");
    let phones = intro.querySelector(".qarip-hero-phones");
    if (!phones) {
      phones = document.createElement("div");
      phones.className = "qarip-hero-phones";
      phones.setAttribute("aria-hidden", "true");
      intro.append(phones);
    }
    phones.innerHTML = STYLE_PREVIEWS.slice(0, 4)
      .map((item, i) => phoneHTML(item, `qarip-phone-${i}`))
      .join("");
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
    if (landing.dataset.ready === "1" && landing.querySelector("#qarip-problems-title")) {
      if (landing.previousElementSibling !== intro) intro.after(landing);
      if (catalog.previousElementSibling !== landing) landing.after(catalog);
      return;
    }
    landing.innerHTML = `
      <section class="qarip-problems" aria-labelledby="qarip-problems-title">
        <h2 id="qarip-problems-title">Қазақша жазғанда қаріп бұзылып кете ме?</h2>
        <ol class="qarip-problem-list">
          <li>Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І әріптері дұрыс шықпайды</li>
          <li>Stories үшін әдемі қаріп комбинациясын табу қиын</li>
          <li>Әр жолы Photoshop немесе басқа редактор ашуға тура келеді</li>
        </ol>
        <p class="qarip-solution">Qarip-та мәтінді жазасыз, стиль таңдайсыз және дайын PNG аласыз.</p>
      </section>
      <section class="qarip-how" aria-labelledby="qarip-how-title">
        <h2 id="qarip-how-title">Қалай жұмыс істейді?</h2>
        <ol class="qarip-steps">
          <li><span>1</span>Мәтінді жазыңыз</li>
          <li><span>2</span>Стиль таңдаңыз</li>
          <li><span>3</span>PNG жүктеп алыңыз</li>
        </ol>
        <p class="qarip-step-micro">Stories-қа салыңыз</p>
      </section>
      <section class="qarip-glyphs" aria-labelledby="qarip-glyphs-title">
        <h2 id="qarip-glyphs-title">Қазақшаға арналған</h2>
        <p class="qarip-glyph-row" lang="kk">Ә Ғ Қ Ң Ө Ұ Ү Һ І</p>
        <p>Qarip қазақ әріптерін қолдайтын қаріптерді табуға және тексеруге көмектеседі. Қаріп комбинациялары қазақ кириллицасындағы негізгі әріптермен тексеріледі.</p>
      </section>
      <section class="qarip-styles" aria-labelledby="qarip-styles-title">
        <h2 id="qarip-styles-title">Дайын стильдер</h2>
        <div class="qarip-style-grid">
          ${STYLE_PREVIEWS.map((item) => phoneHTML(item)).join("")}
        </div>
        <a class="qarip-styles-cta" href="/qarip/stories/">Барлық стильді көру →</a>
      </section>
      <section class="qarip-toolcta" aria-labelledby="qarip-toolcta-title">
        <div class="qarip-toolcta-copy">
          <h2 id="qarip-toolcta-title">Stories үшін мәтін дайындап көріңіз</h2>
          <p>Қазақша мәтінді жазыңыз, қаріп комбинациясын таңдаңыз және дайын 9:16 PNG алыңыз.</p>
          <label class="qarip-teaser-label">Үлгі мәтін
            <input class="qarip-teaser-input" maxlength="42" value="Қазақша Stories" aria-label="Үлгі мәтін"/>
          </label>
          <a class="qarip-cta-primary" href="/qarip/stories/">Stories құралын ашу →</a>
        </div>
        <div class="qarip-teaser-phone" aria-hidden="true">
          <strong class="qarip-teaser-hook">Қазақша Stories</strong>
          <span>9:16 PNG</span>
        </div>
      </section>
      <div id="pricing-slot" hidden></div>
    `;
    intro.after(landing);
    landing.after(catalog);
    landing.dataset.ready = "1";
    const input = landing.querySelector(".qarip-teaser-input");
    const hook = landing.querySelector(".qarip-teaser-hook");
    if (input && hook && input.dataset.bound !== "1") {
      input.dataset.bound = "1";
      input.addEventListener("input", () => {
        hook.textContent = input.value.trim() || "Қазақша Stories";
      });
    }
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
