document.addEventListener("DOMContentLoaded", () => {
  /* =============================== ELEMENTI BASE ================================ */
  const gallery = document.querySelector(".gallery");
  const images = Array.from(gallery?.querySelectorAll("img") ?? []);
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
 
  if (!gallery || images.length === 0) return;

  /* =============================== PRELOAD LEGGERO ================================ */
  images.slice(0, 2).forEach(img => {
    if (!img.complete) {
      const preload = new Image();
      preload.src = img.src;
    }
  });

  /* =============================== STATO ================================ */
  let index = 0;
  let isAnimating = false;

  const GAP = Number.parseFloat(getComputedStyle(gallery).gap) || 24;

  function calcImageWidth() {
    const img = images[0];
    return Math.round(img.offsetWidth + GAP);
  }

  let imageWidth = calcImageWidth();
  const ANIM_DURATION = prefersReducedMotion.matches ? 0 : 280; // ms – uguale al CSS

  images[0].classList.add("active");

  /* =============================== DOTS ================================ */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "gallery-dots";

  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", `Vai alla foto ${i + 1}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");

    dot.addEventListener("click", () => {
      if (isAnimating || i === index) return;
      goTo(i);
    });
    
    dot.setAttribute("tabindex", "0");

  dot.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
     e.preventDefault();
     if (!isAnimating && i !== index) goTo(i);
  }
});

    dotsContainer.appendChild(dot);
  });

  gallery.parentElement.appendChild(dotsContainer);
  const dots = Array.from(dotsContainer.children);

  /* =============================== CORE SLIDER ================================ */
  function goTo(newIndex) {
    if (isAnimating) return;

    isAnimating = true;
    index = newIndex;

    gallery.classList.add("is-sliding");

    requestAnimationFrame(() => {
      gallery.style.transform = `translate3d(${-index * imageWidth}px, 0, 0)`;
    });

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });

    if (ANIM_DURATION === 0) {
      isAnimating = false;
      gallery.classList.remove("is-sliding");
      return;
    }

    setTimeout(() => {
      isAnimating = false;
      gallery.classList.remove("is-sliding");
    }, ANIM_DURATION);
  }

  goTo(0);

  /* =============================== FRECCE ================================ */
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

  document.addEventListener("keydown", e => {
    if (!gallery.contains(document.activeElement)) return;
    if (e.key === "ArrowRight" && index < images.length - 1) {
      goTo(index + 1);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      goTo(index - 1);
    }
  });

  /* =============================== SWIPE MOBILE ================================ */
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

  /* =============================== RESIZE ================================ */
  let resizeTimeout;

  imageWidth = calcImageWidth();
  
  if (prefersReducedMotion.matches) {
    gallery.style.transition = "none";
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      imageWidth = calcImageWidth();
      gallery.style.transition = "none";
      gallery.style.transform = `translate3d(${-index * imageWidth}px, 0, 0)`;

      requestAnimationFrame(() => {
        gallery.style.transition = prefersReducedMotion.matches ? "none" : "";
      });
    }, 150);
  });

  /* =============================== LIGHTBOX ================================ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector("img");

  if (lightbox && lightboxImg) {
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("tabindex", "-1");
    images.forEach(img => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });

      img.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add("active");
          lightbox.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        }
      });
    });

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
});