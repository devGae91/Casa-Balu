document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const images = document.querySelectorAll(".gallery img");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!gallery || images.length === 0) return;

  let index = 0;
  const gap = 24;
  let imageWidth = images[0].offsetWidth + gap;

  function update() {
    gallery.style.transform = `translateX(${-index * imageWidth}px)`;
  }

  nextBtn?.addEventListener("click", () => {
    if (index < images.length - 1) {
      index++;
      update();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      update();
    }
  });

  // === SWIPE MOBILE ===
  let startX = 0;

  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  gallery.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50 && index < images.length - 1) {
      index++;
    } else if (diff < -50 && index > 0) {
      index--;
    }
    update();
  });

  window.addEventListener("resize", () => {
    imageWidth = images[0].offsetWidth + gap;
    update();
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
document.body.appendChild(lightbox);

const lightImg = document.createElement("img");
lightbox.appendChild(lightImg);

document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {
    lightImg.src = img.src;
    lightbox.classList.add("active");
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
