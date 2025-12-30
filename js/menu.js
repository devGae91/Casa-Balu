document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.querySelector(".main-nav");

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
});
