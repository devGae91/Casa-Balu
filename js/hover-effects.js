document.addEventListener("DOMContentLoaded", () => {
  const hoverables = document.querySelectorAll(
    ".calendar-box, .booking-form, .territory-box, .price-box, .hero-content"
  );

  hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => {
      el.style.transform = "translateY(-6px)";
      el.style.boxShadow = "0 35px 80px rgba(0,0,0,0.18)";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translateY(0)";
      el.style.boxShadow = "";
    });
  });
});
