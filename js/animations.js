document.addEventListener("DOMContentLoaded", () => {
  /* =============================== FADE / REVEAL OBSERVER ================================ */
  const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-left, .fade-right, .reveal"
  );

  if (animatedElements.length) {
    const animationObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = [...animatedElements].indexOf(el) * 60;

          el.style.transitionDelay = `${Math.min(delay, 240)}ms`;
          el.classList.add("visible");

          animationObserver.unobserve(el);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  /* =============================== BOOKING HIGHLIGHT ================================ */
  const bookingSection = document.querySelector("#prenotazione");

  if (bookingSection) {
    const bookingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bookingSection.classList.add("highlight");
          bookingObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.35 }
    );

    bookingObserver.observe(bookingSection);
  }

  /* =============================== SCROLL PROGRESS BAR ================================ */
  const progressBar = document.getElementById("scroll-progress");
  let ticking = false;

  if (progressBar) {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scroll =
            window.scrollY /
            (document.body.scrollHeight - window.innerHeight);

          progressBar.style.width = `${scroll * 100}%`;
          ticking = false;
        });

        ticking = true;
      }
    });
  }
});