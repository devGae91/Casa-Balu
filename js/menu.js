document.addEventListener("DOMContentLoaded", () => {

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  const links = nav?.querySelectorAll("a");

  if (!burger || !nav) return;

  function openMenu() {
    nav.classList.add("open");
    document.body.classList.add("menu-open");
    burger.classList.add("active");
    burger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    burger.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
  }

  /* ===============================
     TOGGLE BURGER
  ================================ */
  burger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  /* ===============================
     CLOSE ON LINK CLICK
  ================================ */
  links?.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* ===============================
     CLOSE ON CLICK OUTSIDE
  ================================ */
  document.addEventListener("click", e => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ===============================
     CLOSE ON ESC
  ================================ */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
    }
  });

});
