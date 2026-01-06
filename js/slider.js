document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     GALLERY PRELOAD (LCP & UX)
  ================================ */
  document.querySelectorAll(".gallery img").forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  const gallery = document.querySelector(".gallery");
  const images = document.querySelectorAll(".gallery img");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!gallery || images.length === 0) return;

  let index = 0;
  const gap = 24;
  let imageWidth = images[0].offsetWidth + gap;

  /* ===============================
     DOTS (AUTO)
  ================================ */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "gallery-dots";

  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  gallery.parentElement.appendChild(dotsContainer);
  const dots = dotsContainer.querySelectorAll("span");

  /* ===============================
   DOTS CLICK
================================ */
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    if (isSliding || i === index) return;

    isSliding = true;
    gallery.classList.add("is-sliding");

    requestAnimationFrame(() => {
      index = i;
      update();
    });

    setTimeout(() => {
      isSliding = false;
      gallery.classList.remove("is-sliding");
    }, SLIDE_DURATION);
  });
});

  /* ===============================
     SLIDE STATE (ANTI-SPAM CLICK)
  ================================ */
  let isSliding = false;
  const SLIDE_DURATION = 350; // ms (coerente con CSS)

  /* ===============================
     UPDATE (INP OPTIMIZED)
  ================================ */
  function update() {

    // movimento (paint ottimizzato)
    requestAnimationFrame(() => {
      gallery.style.transform =
        `translateX(${-index * imageWidth}px)`;
    });

    // classi & dots (separato)
    requestAnimationFrame(() => {
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
        img.classList.toggle("inactive", i !== index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
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
    const centerY = rect.top + rect.height / 2;
    const offsetY = (e.clientY - centerY) / rect.height;

    if (parallaxRAF) cancelAnimationFrame(parallaxRAF);

    parallaxRAF = requestAnimationFrame(() => {
      activeImg.style.transform =
  `translateY(${offsetY * 4}px)`;
    });
  });

  gallery.addEventListener("mouseleave", () => {
    const activeImg = gallery.querySelector("img.active");
    if (!activeImg) return;

    activeImg.style.transform = "translateY(0)";
  });

  /* ===============================
     BUTTONS (INP SAFE)
  ================================ */
 nextBtn?.addEventListener("click", () => {
  if (isSliding || index >= images.length - 1) return;

  isSliding = true;
  gallery.classList.add("is-sliding");

  index++;
  update();

  setTimeout(() => {
    isSliding = false;
    gallery.classList.remove("is-sliding");
  }, SLIDE_DURATION);
});

  prevBtn?.addEventListener("click", () => {
  if (isSliding || index <= 0) return;

  isSliding = true;
  gallery.classList.add("is-sliding");

  index--;
  update();

  setTimeout(() => {
    isSliding = false;
    gallery.classList.remove("is-sliding");
  }, SLIDE_DURATION);
});


  /* ===============================
     SWIPE MOBILE (SAFE)
  ================================ */
  let startX = 0;

  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  gallery.addEventListener("touchend", e => {
  if (isSliding) return;

  const diff = startX - e.changedTouches[0].clientX;

  if (diff > 50 && index < images.length - 1) {
    isSliding = true;
    gallery.classList.add("is-sliding");
    index++;
  }

  if (diff < -50 && index > 0) {
    isSliding = true;
    gallery.classList.add("is-sliding");
    index--;
  }

  update();

  setTimeout(() => {
    isSliding = false;
    gallery.classList.remove("is-sliding");
  }, SLIDE_DURATION);
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

