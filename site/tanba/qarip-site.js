(() => {
  const HOME_TITLE = "Таңба — қазақша Stories құралы";
  const HOME_DESC =
    "Қазақша Stories редакторымен мәтін, қаріп және фонды біріктіріп, дайын 9:16 PNG жасаңыз.";
  const STORIES_TITLE = "Қазақша Stories редакторы | Таңба";
  const STORIES_DESC =
    "Қазақша Stories үшін мәтін, қаріп, фон және логотиппен дайын 9:16 PNG жасаңыз.";
  const DISCLAIMER =
    "Таңба — қазақша Stories жасау құралы. Қаріп каталогы Qarip өнімінде. Қаріптердің авторлық құқықтары тиісті құқық иелеріне тиесілі.";

  let timer = 0;

  function isStoriesPage() {
    return /\/tanba\/stories\/?$/.test(location.pathname);
  }

  function isLegacyReelsPage() {
    return /\/tanba\/reels\/?$/.test(location.pathname);
  }

  function redirectLegacy() {
    if (isLegacyReelsPage()) {
      location.replace("/tanba/stories/");
      return true;
    }
    if (!isStoriesPage() && location.hash === "#reels") {
      location.replace("/tanba/stories/");
      return true;
    }
    return false;
  }

  function markPage() {
    document.documentElement.classList.toggle("qarip-stories", isStoriesPage());
    document.documentElement.classList.toggle("qarip-home", !isStoriesPage());
    document.documentElement.classList.add("qarip-v2");
  }

  function polishNav() {
    document.querySelectorAll(".topbar nav a").forEach((link) => {
      const label = (link.textContent || "").replace(/\s+/g, " ").trim();
      const href = link.getAttribute("href") || "";
      if (label === "Reels" || href === "#reels" || /\/tanba\/reels\/?$/.test(href)) {
        link.textContent = "Stories";
        link.setAttribute("href", "/tanba/stories/");
        return;
      }
      if (label === "Қаріптер") {
        link.setAttribute("href", "/qarip/#catalog");
        return;
      }
      if (label === "Stories") {
        link.setAttribute("href", "/tanba/stories/");
        return;
      }
      if (label === "Жоба туралы") {
        link.setAttribute("href", isStoriesPage() ? "/tanba/#about" : "#about");
      }
    });

    const brand = document.querySelector(".topbar .brand");
    if (brand) {
      brand.setAttribute("href", "/tanba/");
      brand.setAttribute("aria-label", "Таңба — басты бет");
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
      search.href = "/qarip/#catalog";
      search.setAttribute("aria-label", "Қаріптерді іздеу");
      search.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
      actions.append(search);
    } else {
      actions.querySelector(".qarip-nav-search").href = "/qarip/#catalog";
    }

    if (!actions.querySelector(".qarip-nav-start")) {
      const start = document.createElement("a");
      start.className = "qarip-nav-start";
      start.href = "/tanba/stories/";
      start.textContent = "Бастау →";
      actions.append(start);
    } else {
      actions.querySelector(".qarip-nav-start").href = "/tanba/stories/";
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

  function polishAboutFooter() {
    const aboutP = document.querySelector("#about p");
    if (aboutP && !aboutP.querySelector("a")) aboutP.textContent = DISCLAIMER;
    const footer = document.querySelector("footer");
    if (!footer) return;

    let slogan = footer.querySelector(".qarip-footer-slogan");
    if (!slogan) {
      slogan = document.createElement("p");
      slogan.className = "qarip-footer-slogan";
      footer.append(slogan);
    }
    slogan.textContent = "Жақсы Stories — жарқын күндерге! ♡";

    let nav = footer.querySelector(".qarip-footer-nav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "qarip-footer-nav";
      nav.setAttribute("aria-label", "Төменгі мәзір");
      slogan.after(nav);
    }
    nav.innerHTML = `
      <a href="/qarip/">Qarip</a>
      <a href="/tanba/stories/">Stories</a>
      <a href="${isStoriesPage() ? "/tanba/#about" : "#about"}">Жоба туралы</a>
      <a href="/">AQSUEK</a>
    `;
  }

  function ensureStoriesEditorAssets() {
    if (!isStoriesPage()) return;
    if (!document.querySelector('link[data-stories-editor-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/tanba/stories-editor.css?v=tanba18";
      link.dataset.storiesEditorCss = "1";
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-stories-editor]')) {
      const script = document.createElement("script");
      script.src = "/tanba/stories-editor.js?v=tanba18";
      script.defer = true;
      script.dataset.storiesEditor = "1";
      document.body.appendChild(script);
    }
  }

  function isHomePolished() {
    return !!(
      document.querySelector(".intro.qarip-hero .qarip-hero-copy") &&
      document.querySelector(".topbar .qarip-nav-actions")
    );
  }

  let applying = false;

  function apply() {
    if (applying) return;
    applying = true;
    try {
      if (redirectLegacy()) return;
      markPage();
      polishNav();
      if (isStoriesPage()) {
        ensureStoriesEditorAssets();
        setMeta(STORIES_TITLE, STORIES_DESC, "https://aqsuek.kz/tanba/stories/");
      } else {
        setMeta(HOME_TITLE, HOME_DESC, "https://aqsuek.kz/tanba/");
        if (isHomePolished()) document.documentElement.classList.add("qarip-booted");
      }
      polishAboutFooter();
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
    if (isStoriesPage()) {
      new MutationObserver(() => {
        if (document.title !== STORIES_TITLE) document.title = STORIES_TITLE;
      }).observe(document.head, { childList: true });
    }
  }

  window.QaripSite = { isStoriesPage, apply };

  if (redirectLegacy()) return;
  markPage();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch);
  else watch();
  window.addEventListener("load", () => {
    setTimeout(apply, 80);
    setTimeout(() => {
      if (!isStoriesPage() && isHomePolished()) {
        document.documentElement.classList.add("qarip-booted");
      }
    }, 400);
  });
})();
