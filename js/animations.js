document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SCROLL PROGRESS (THROTTLED)
  =============================== */
  const progressBar = document.getElementById("scroll-progress");

  let ticking = false;

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  });

  /* ===============================
     REVEAL ANIMATIONS (SAFE)
  =============================== */
  const revealElements = document.querySelectorAll(
    ".fade-in, .fade-left, .fade-right, .reveal"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(el => observer.observe(el));

});