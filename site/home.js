(() => {
  const root = document.documentElement;
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setNav(open) {
    root.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Мәзірді жабу" : "Мәзір");
    }
  }

  toggle?.addEventListener("click", () => {
    setNav(!root.classList.contains("nav-open"));
  });

  document.addEventListener("click", (event) => {
    if (!root.classList.contains("nav-open")) return;
    const t = event.target;
    if (!(t instanceof Element)) return;
    if (t.closest(".nav-toggle") || t.closest(".site-nav")) return;
    setNav(false);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const reveals = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i * 40, 200)}ms`);
      io.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  }

  const cards = document.querySelectorAll(".project-card");
  if (!reduceMotion) {
    cards.forEach((card) => {
      const preview = card.querySelector(".project-preview");
      if (!preview) return;
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      card.addEventListener("pointerleave", () => {
        preview.style.transform = "";
      });
    });
  }
})();
