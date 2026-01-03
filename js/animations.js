document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     FADE / SLIDE ANIMATIONS
  ================================ */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll(".fade-in, .fade-left, .fade-right")
    .forEach(el => observer.observe(el));

  /* ===============================
     BOOKING HIGHLIGHT
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
     HERO PARALLAX (LEGGERO)
  ================================ */
  const hero = document.querySelector(".hero");

  if (hero) {
    window.addEventListener("scroll", () => {
      hero.style.backgroundPositionY =
        window.scrollY * 0.3 + "px";
    });
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

      progressBar.style.width = scroll * 100 + "%";
    });
  }

});
