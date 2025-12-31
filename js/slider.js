document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const images = document.querySelectorAll(".gallery img");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (!gallery || images.length === 0) return;

  let index = 0;
  const gap = 24;
  let imageWidth = images[0].offsetWidth + gap;

  /* === DOTS === */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "gallery-dots";
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  gallery.parentElement.appendChild(dotsContainer);
  const dots = dotsContainer.querySelectorAll("span");

  function update() {
    gallery.style.transform = `translateX(${-index * imageWidth}px)`;

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
      img.classList.toggle("inactive", i !== index);
    });

    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  update();

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

  /* === SWIPE MOBILE === */
  let startX = 0;
  gallery.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  gallery.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50 && index < images.length - 1) index++;
    if (diff < -50 && index > 0) index--;
    update();
  });

  window.addEventListener("resize", () => {
    imageWidth = images[0].offsetWidth + gap;
    update();
  });

  /* === LIGHTBOX === */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  const lbImg = document.createElement("img");
  lightbox.appendChild(lbImg);
  document.body.appendChild(lightbox);

  images.forEach(img => {
    img.addEventListener("click", () => {
      lbImg.src = img.src;
      lightbox.classList.add("active");
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });
});
