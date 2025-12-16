document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.style = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.85);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:1000;
    `;

    const fullImg = document.createElement("img");
    fullImg.src = img.src;
    fullImg.style = "max-width:90%;max-height:90%;border-radius:12px;";

    overlay.appendChild(fullImg);
    overlay.addEventListener("click", () => overlay.remove());
    document.body.appendChild(overlay);
  });
});
