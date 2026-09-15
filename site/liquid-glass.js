/* AQSUEK — Apple Liquid Glass glue (v2).
   Keeps the material reactive without animating the page behind it:
   - accessibility state sync (reduced transparency / no backdrop-filter)
   - scroll state for bar compaction and the scroll edge effect
   - pointer-driven rim light direction */
(() => {
  const root = document.documentElement;
  const mql = (q) =>
    window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener() {} };

  const reducedTransparency = mql("(prefers-reduced-transparency: reduce)");
  const reducedMotion = mql("(prefers-reduced-motion: reduce)");

  const syncSolid = () => root.classList.toggle("lg-solid", !!reducedTransparency.matches);
  syncSolid();
  reducedTransparency.addEventListener?.("change", syncSolid);

  if (!window.CSS || !CSS.supports || !CSS.supports("backdrop-filter", "blur(1px)")) {
    root.classList.add("lg-solid");
  }

  const setupScrollState = () => {
    const bar = document.querySelector(".site-header, .topbar");
    let ticking = false;
    const update = () => {
      ticking = false;
      const scrolled = (window.scrollY || 0) > 8;
      root.classList.toggle("lg-scrolled", scrolled);
      bar?.classList.toggle("lg-scrolled", scrolled);
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  };

  /* Rim light follows the pointer: the highlight sweeps around the edge of
     every glass surface the way it tracks device motion on iOS. */
  const setupRimLight = () => {
    if (reducedMotion.matches) return;
    let ticking = false;
    let x = 0.5;
    let y = 0;
    const apply = () => {
      ticking = false;
      root.style.setProperty("--lg-mx", (x * 100).toFixed(1) + "%");
      root.style.setProperty("--lg-my", (y * 100).toFixed(1) + "%");
      const angle = 90 + (x - 0.5) * 120 + (y - 0.5) * 60;
      root.style.setProperty("--lg-angle", angle.toFixed(1) + "deg");
    };
    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX / (window.innerWidth || 1);
        y = e.clientY / (window.innerHeight || 1);
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );
  };

  /* Per-control specular: the highlight inside a button tracks the pointer,
     and a press triggers a short gel squash. */
  const CONTROLS = [
    ".btn-primary", ".btn-ghost", ".qarip-cta-primary", ".qarip-cta-secondary",
    ".qarip-nav-start", ".catalog-more", ".font-download", ".font-favorite",
    ".qarip-dl-go", ".qarip-dl-info", ".categories button",
    ".card-bottom a[download]", ".leto-export", ".leto-dock-btn",
    ".leto-icon", ".leto-fab", ".leto-choice-card", ".leto-choice-back",
    ".nav-toggle", ".qarip-nav-toggle", ".qarip-nav-search"
  ].join(",");

  const setupControls = () => {
    let frame = 0;
    let pending = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      pending = null;
      el.style.setProperty("--bx", x + "%");
      el.style.setProperty("--by", y + "%");
    };

    document.addEventListener(
      "pointermove",
      (e) => {
        const el = e.target instanceof Element ? e.target.closest(CONTROLS) : null;
        if (!el || reducedMotion.matches) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        pending = {
          el,
          x: (((e.clientX - r.left) / r.width) * 100).toFixed(1),
          y: (((e.clientY - r.top) / r.height) * 100).toFixed(1)
        };
        if (!frame) frame = requestAnimationFrame(flush);
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      (e) => {
        const el = e.target instanceof Element ? e.target.closest(CONTROLS) : null;
        if (!el) return;
        el.style.removeProperty("--bx");
        el.style.removeProperty("--by");
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerdown",
      (e) => {
        const el = e.target instanceof Element ? e.target.closest(CONTROLS) : null;
        if (!el || reducedMotion.matches) return;
        el.classList.remove("lg-press");
        /* Reflow so the animation restarts on rapid repeated taps. */
        void el.offsetWidth;
        el.classList.add("lg-press");
        el.addEventListener(
          "animationend",
          () => el.classList.remove("lg-press"),
          { once: true }
        );
      },
      { passive: true }
    );
  };

  /* Menu scrim: blurs the page behind an open menu, closes it on tap.
     Two products, two class names — handle both. */
  const OPEN_CLASSES = ["nav-open", "qarip-nav-open"];
  const isMenuOpen = () => OPEN_CLASSES.some((c) => root.classList.contains(c));

  const setupMenuScrim = () => {
    const scrim = document.createElement("div");
    scrim.className = "lg-scrim";
    scrim.setAttribute("aria-hidden", "true");
    document.body.appendChild(scrim);

    const closeMenu = () => {
      OPEN_CLASSES.forEach((c) => root.classList.remove(c));
      document
        .querySelectorAll(".nav-toggle, .qarip-nav-toggle")
        .forEach((t) => t.setAttribute("aria-expanded", "false"));
      sync();
    };

    const sync = () => scrim.classList.toggle("on", isMenuOpen());

    scrim.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen()) closeMenu();
    });

    /* The toggles live in page scripts, so mirror their class changes. */
    new MutationObserver(sync).observe(root, {
      attributes: true,
      attributeFilter: ["class"]
    });
    sync();
  };

  const init = () => {
    setupScrollState();
    setupRimLight();
    setupControls();
    setupMenuScrim();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
