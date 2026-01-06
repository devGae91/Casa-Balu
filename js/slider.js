document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     GALLERY PRELOAD (LCP & UX)
  ================================ */
  document.querySelectorAll(".gallery img").forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  const gallery = document.querySelector(".gallery");
  const images = Array.from(document.querySelectorAll(".gallery img"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!gallery || images.length === 0) return;

  let index = 0;
  const gap = 24;
  let imageWidth = images[0].offsetWidth + gap;
  images[0].classList.add("active");

  /* ===============================
     DOTS (AUTO)
  ================================ */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "gallery-dots";

  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      if (i === index) return;
      index = i;
      update();
    });
    dotsContainer.appendChild(dot);
  });

  gallery.parentElement.appendChild(dotsContainer);
  const dots = Array.from(dotsContainer.children);

  /* ===============================
     UPDATE (LIGHT & FAST)
  ================================ */
  function update() {
    requestAnimationFrame(() => {
      gallery.style.transform = `translateX(${-index * imageWidth}px)`;
    });

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  update();

  /* ===============================
     MICRO PARALLAX (DESKTOP ONLY)
  ================================ */
  let parallaxRAF = null;

  gallery.addEventListener("mousemove", e => {
    if (window.innerWidth < 768) return;

    const activeImg = gallery.querySelector("img.active");
    if (!activeImg) return;

    const rect = gallery.getBoundingClientRect();
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    if (parallaxRAF) cancelAnimationFrame(parallaxRAF);

    parallaxRAF = requestAnimationFrame(() => {
      activeImg.style.transform = `translateY(${offsetY * 4}px) scale(1.06)`;
    });
  });

  gallery.addEventListener("mouseleave", () => {
    const activeImg = gallery.querySelector("img.active");
    if (activeImg) activeImg.style.transform = "scale(1.06)";
  });

  /* ===============================
     BUTTONS
  ================================ */
  nextBtn?.addEventListener("click", () => {
    if (index >= images.length - 1) return;
    index++;
    update();
  });

  /* ===============================
     SWIPE MOBILE
  ================================ */
  let startX = 0;

  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  gallery.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;

    if (diff > 50 && index < images.length - 1) index++;
    if (diff < -50 && index > 0) index--;

    update();
  });

  /* ===============================
     RESIZE (DEBOUNCED)
  ================================ */
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      imageWidth = images[0].offsetWidth + gap;
      update();
    }, 150);
  });

  /* ===============================
     LIGHTBOX
  ================================ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector("img");

  if (lightbox && lightboxImg) {
    images.forEach(img => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox || e.target === lightboxImg) {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
        document.body.style.overflow = "";
      }
    });
  }

});
