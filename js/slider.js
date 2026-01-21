document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ELEMENTI BASE
  ================================ */
  const gallery = document.querySelector(".gallery");
  const images = Array.from(document.querySelectorAll(".gallery img"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!gallery || images.length === 0) return;

  /* ===============================
     PRELOAD LEGGERO (SAFE)
     → solo prime 2 immagini
  ================================ */
  images.slice(0, 2).forEach(img => {
    if (!img.complete) {
      const preload = new Image();
      preload.src = img.src;
    }
  });

  /* ===============================
     STATO
  ================================ */
  let index = 0;
  let isAnimating = false;
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
      if (i === index || isAnimating) return;
      goTo(i);
    });

    dotsContainer.appendChild(dot);
  });

  gallery.parentElement.appendChild(dotsContainer);
  const dots = Array.from(dotsContainer.children);

  /* ===============================
     CORE SLIDER
  ================================ */
  function goTo(newIndex) {
    if (isAnimating) return;

    index = newIndex;
    isAnimating = true;

    requestAnimationFrame(() => {
      gallery.style.transform =
        `translate3d(${-index * imageWidth}px, 0, 0)`;
    });

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  gallery.addEventListener("transitionend", () => {
    isAnimating = false;
  });

  goTo(0);

  /* ===============================
     BUTTON CONTROLS (INP SAFE)
  ================================ */
  nextBtn?.addEventListener("click", e => {
    if (isAnimating || index >= images.length - 1) return;

    // feedback immediato (riduce INP)
    e.currentTarget.style.opacity = "0.85";
    requestAnimationFrame(() => {
      e.currentTarget.style.opacity = "";
    });

    goTo(index + 1);
  });

  prevBtn?.addEventListener("click", e => {
    if (isAnimating || index <= 0) return;

    e.currentTarget.style.opacity = "0.85";
    requestAnimationFrame(() => {
      e.currentTarget.style.opacity = "";
    });

    goTo(index - 1);
  });

  /* ===============================
     SWIPE (INTENZIONALE)
  ================================ */
  let startX = 0;
  let startY = 0;

  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  gallery.addEventListener("touchend", e => {
    const diffX = startX - e.changedTouches[0].clientX;
    const diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (diffX > 60 && index < images.length - 1) {
      goTo(index + 1);
    }

    if (diffX < -60 && index > 0) {
      goTo(index - 1);
    }
  });

  /* ===============================
     RESIZE (DEBOUNCED)
  ================================ */
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      imageWidth = images[0].offsetWidth + gap;
      goTo(index);
    }, 150);
  });

  /* ===============================
     LIGHTBOX (PREMIUM & ACCESSIBILE)
  ================================ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector("img");

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  if (lightbox && lightboxImg) {
    images.forEach(img => {

      // click
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });

      // tastiera (ENTER)
      img.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          lightboxImg.src = img.src;
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    // click fuori
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });

    // ESC
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

});
