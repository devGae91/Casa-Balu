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
     PRELOAD LEGGERO
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
  const ANIM_DURATION = 280; // deve combaciare col CSS

  images[0].classList.add("active");

  /* ===============================
     DOTS
  ================================ */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "gallery-dots";

  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      if (isAnimating || i === index) return;
      goTo(i);
    });

    dotsContainer.appendChild(dot);
  });

  gallery.parentElement.appendChild(dotsContainer);
  const dots = Array.from(dotsContainer.children);

  /* ===============================
     CORE SLIDER (ROBUSTO)
  ================================ */
  function goTo(newIndex) {
    if (isAnimating) return;

    isAnimating = true;
    index = newIndex;

    gallery.classList.add("is-sliding");

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

    // 🔒 sblocco GARANTITO (no deadlock)
    setTimeout(() => {
      isAnimating = false;
      gallery.classList.remove("is-sliding");
    }, ANIM_DURATION);
  }

  goTo(0);

  /* ===============================
     FRECCE (INP SAFE)
  ================================ */
  nextBtn?.addEventListener("click", () => {
    if (isAnimating || index >= images.length - 1) return;
    nextBtn.classList.add("pressed");
    requestAnimationFrame(() => nextBtn.classList.remove("pressed"));
    goTo(index + 1);
  });

  prevBtn?.addEventListener("click", () => {
    if (isAnimating || index <= 0) return;
    prevBtn.classList.add("pressed");
    requestAnimationFrame(() => prevBtn.classList.remove("pressed"));
    goTo(index - 1);
  });

  /* ===============================
     SWIPE
  ================================ */
  let startX = 0;
  let startY = 0;

  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  gallery.addEventListener("touchend", e => {
    if (isAnimating) return;

    const diffX = startX - e.changedTouches[0].clientX;
    const diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (diffX > 60 && index < images.length - 1) goTo(index + 1);
    if (diffX < -60 && index > 0) goTo(index - 1);
  });

  /* ===============================
     RESIZE
  ================================ */
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      imageWidth = images[0].offsetWidth + gap;
      gallery.style.transition = "none";
      gallery.style.transform =
        `translate3d(${-index * imageWidth}px,0,0)`;
      requestAnimationFrame(() => {
        gallery.style.transition = "";
      });
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

      img.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          lightboxImg.src = img.src;
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
        document.body.style.overflow = "";
      }
    });
  }

});