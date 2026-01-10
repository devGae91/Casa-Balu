document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     REVEAL / FADE / SLIDE (UNIFIED)
  ================================ */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll(".fade-in, .fade-left, .fade-right, .reveal")
    .forEach(el => revealObserver.observe(el));

  /* ===============================
     BOOKING HIGHLIGHT (FOCUS UX)
  ================================ */
  const bookingSection = document.querySelector("#prenotazione");

  if (bookingSection) {
    const bookingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bookingSection.classList.add("highlight");
        }
      },
      { threshold: 0.3 }
    );

    bookingObserver.observe(bookingSection);
  }

  /* ===============================
     SCROLL PROGRESS BAR
  ================================ */
  const progressBar = document.getElementById("scroll-progress");

  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scroll =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight);

      progressBar.style.width = (scroll * 100) + "%";
    });
  }

});
