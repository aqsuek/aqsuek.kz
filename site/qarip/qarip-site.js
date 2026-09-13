(() => {
  const HOME_TITLE = "Qarip — қазақша қаріптер каталогы";
  const HOME_DESC =
    "Қазақ әріптерін қолдайтын қаріптерді іздеңіз, өз мәтініңізбен тексеріңіз және жүктеңіз.";
  const DISCLAIMER =
    "Qarip қаріптердің қазақ әліпбиін қолдауын тексеруге және оларды табуды жеңілдетуге арналған. Қаріптердің авторлық құқықтары тиісті құқық иелеріне тиесілі. Коммерциялық қолданар алдында әр қаріптің лицензия шарттарын тексеріңіз.";

  const READY = "v2q";
  let timer = 0;

  function isFontDetailPage() {
    return /\/qarip\/font\//.test(location.pathname);
  }

  function markPage() {
    document.documentElement.classList.add("qarip-home", "qarip-v2");
    document.documentElement.classList.remove("qarip-stories");
  }

  function fontCount() {
    const count = document.querySelector(".workspace-heading .count");
    const match = count?.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) return match[2];
    const cards = document.querySelectorAll(".font-grid > .font-card").length;
    return cards ? String(cards) : "";
  }

  function polishNav() {
    document.querySelectorAll(".topbar nav a").forEach((link) => {
      const label = (link.textContent || "").replace(/\s+/g, " ").trim();
      if (label === "Stories" || label === "Reels") {
        link.textContent = "Stories";
        link.setAttribute("href", "/tanba/stories/");
        return;
      }
      if (label === "Қаріптер") {
        link.setAttribute("href", isFontDetailPage() ? "/qarip/#catalog" : "#catalog");
        return;
      }
      if (label === "Онлайн тексеру") {
        link.setAttribute("href", isFontDetailPage() ? "/qarip/#tester" : "#tester");
        return;
      }
      if (label === "Жоба туралы") {
        link.setAttribute("href", isFontDetailPage() ? "/qarip/#about" : "#about");
      }
    });

    const brand = document.querySelector(".topbar .brand");
    if (brand) {
      brand.setAttribute("href", "/qarip/");
      brand.setAttribute("aria-label", "Qarip — басты бет");
    }

    const topbar = document.querySelector(".topbar");
    if (!topbar) return;

    let actions = topbar.querySelector(".qarip-nav-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "qarip-nav-actions";
      topbar.append(actions);
    }

    if (!actions.querySelector(".qarip-nav-search")) {
      const search = document.createElement("a");
      search.className = "qarip-nav-search";
      search.href = isFontDetailPage() ? "/qarip/#catalog" : "#catalog";
      search.setAttribute("aria-label", "Қаріптерді іздеу");
      search.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
      actions.append(search);
    } else {
      actions.querySelector(".qarip-nav-search").href = isFontDetailPage()
        ? "/qarip/#catalog"
        : "#catalog";
    }

    if (!actions.querySelector(".qarip-nav-start")) {
      const start = document.createElement("a");
      start.className = "qarip-nav-start";
      start.href = "/tanba/stories/";
      start.textContent = "Stories →";
      actions.append(start);
    } else {
      const start = actions.querySelector(".qarip-nav-start");
      start.href = "/tanba/stories/";
      start.textContent = "Stories →";
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

    if (topbar.dataset.v2Nav !== "1") {
      topbar.dataset.v2Nav = "1";
      topbar.querySelector("nav")?.addEventListener("click", (event) => {
        if (!(event.target instanceof Element) || !event.target.closest("a")) return;
        document.documentElement.classList.remove("qarip-nav-open");
        actions.querySelector(".qarip-nav-toggle")?.setAttribute("aria-expanded", "false");
      });
    }
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

  function ensureLanding() {
    if (isFontDetailPage()) {
      document.querySelector(".qarip-landing")?.remove();
      return;
    }
    const catalog = document.getElementById("catalog");
    if (!catalog) return;
    let landing = document.querySelector(".qarip-landing");
    if (!landing) {
      landing = document.createElement("div");
      landing.className = "qarip-landing";
    }
    if (landing.dataset.ready === READY) {
      if (landing.previousElementSibling !== catalog) catalog.after(landing);
      return;
    }

    const n = fontCount();
    landing.innerHTML = `
      <section class="qarip-toolcta" aria-labelledby="qarip-toolcta-title">
        <div class="qarip-toolcta-copy">
          <h2 id="qarip-toolcta-title">Stories керек пе?</h2>
          <p>Қаріпті таңдап, Tañba редакторында 9:16 PNG жасаңыз.${n ? ` ${n} қаріп қолжетімді.` : ""}</p>
        </div>
        <a class="qarip-cta-primary" href="/tanba/stories/">Tañba Stories →</a>
      </section>
    `;
    catalog.after(landing);
    landing.dataset.ready = READY;
  }

  function polishCatalog() {
    if (isFontDetailPage()) return;
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

  function polishAboutFooter() {
    const aboutH = document.querySelector("#about h2");
    if (aboutH) aboutH.textContent = "Жоба туралы";
    const aboutP = document.querySelector("#about p");
    if (aboutP) aboutP.textContent = DISCLAIMER;
    const footer = document.querySelector("footer");
    if (!footer) return;

    let slogan = footer.querySelector(".qarip-footer-slogan");
    if (!slogan) {
      slogan = document.createElement("p");
      slogan.className = "qarip-footer-slogan";
      footer.append(slogan);
    }
    slogan.textContent = "Қазақша әріптер — дұрыс қаріппен. ♡";

    let nav = footer.querySelector(".qarip-footer-nav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "qarip-footer-nav";
      nav.setAttribute("aria-label", "Төменгі мәзір");
      slogan.after(nav);
    }
    nav.innerHTML = `
      <a href="${isFontDetailPage() ? "/qarip/#catalog" : "#catalog"}">Қаріптер</a>
      <a href="/tanba/stories/">Stories</a>
      <a href="${isFontDetailPage() ? "/qarip/#about" : "#about"}">Жоба туралы</a>
      <a href="/">AQSUEK</a>
    `;
  }

  function isHomePolished() {
    return !!(
      document.querySelector(".intro.qarip-hero") &&
      document.querySelector(".topbar .qarip-nav-actions")
    );
  }

  function syncHomeBoot() {
    if (isHomePolished()) document.documentElement.classList.add("qarip-booted");
  }

  let applying = false;

  function apply() {
    if (applying) return;
    applying = true;
    try {
      markPage();
      polishNav();
      if (!isFontDetailPage()) {
        ensureLanding();
        polishCatalog();
        setMeta(HOME_TITLE, HOME_DESC, "https://aqsuek.kz/qarip/");
      }
      polishAboutFooter();
      syncHomeBoot();
    } finally {
      queueMicrotask(() => {
        applying = false;
      });
    }
  }

  function scheduleApply() {
    clearTimeout(timer);
    timer = setTimeout(apply, 40);
  }

  function watch() {
    apply();
    const topbar = document.querySelector(".topbar");
    if (topbar) {
      new MutationObserver(scheduleApply).observe(topbar, { childList: true, subtree: true });
    }
    const main = document.querySelector("main");
    if (main) {
      new MutationObserver((mutations) => {
        const noisy = mutations.every((m) => {
          const t = m.target;
          if (!(t instanceof Element)) return false;
          return !!(t.closest?.(".font-grid") || t.classList?.contains("font-grid"));
        });
        if (noisy) return;
        scheduleApply();
      }).observe(main, { childList: true, subtree: true });
    }
  }

  window.QaripSite = { apply, fontCount, isFontDetailPage };

  markPage();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch);
  else watch();
  window.addEventListener("load", () => {
    setTimeout(apply, 80);
    setTimeout(() => {
      if (isHomePolished()) document.documentElement.classList.add("qarip-booted");
    }, 400);
  });
})();
