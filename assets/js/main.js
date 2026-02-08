/**
 * Template Name: Bocor
 * Updated & hardened for multi-page system (Hub / Login / Public)
 */

(function () {
  "use strict";

  /* =========================
     SCROLL HEADER STATE
  ========================== */
  function toggleScrolled() {
    const body = document.querySelector("body");
    const header = document.querySelector("#header");

    if (!header) return;

    if (
      !header.classList.contains("scroll-up-sticky") &&
      !header.classList.contains("sticky-top") &&
      !header.classList.contains("fixed-top")
    ) return;

    window.scrollY > 100
      ? body.classList.add("scrolled")
      : body.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /* =========================
     MOBILE NAV TOGGLE
  ========================== */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToggle() {
    document.body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  /* =========================
     CLOSE MOBILE NAV ON LINK
  ========================== */
  document.querySelectorAll(".navmenu a").forEach(link => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  /* =========================
     DROPDOWN MOBILE MENU
  ========================== */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach(toggle => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");

      const dropdown = this.parentNode.nextElementSibling;
      if (dropdown) {
        dropdown.classList.toggle("dropdown-active");
      }

      e.stopImmediatePropagation();
    });
  });

  /* =========================
     PRELOADER
  ========================== */
  const preloader = document.querySelector("#preloader");

  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /* =========================
     SCROLL TO TOP
  ========================== */
  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTop) return;

    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", toggleScrollTop);
    window.addEventListener("load", toggleScrollTop);
  }

  /* =========================
     AOS INIT
  ========================== */
  function aosInit() {
    if (typeof AOS === "undefined") return;

    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }

  window.addEventListener("load", aosInit);

  /* =========================
     GLIGHTBOX
  ========================== */
  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: ".glightbox"
      autoplayVideos: true,
      touchNavigation: true
    });
  }

  /* =========================
     SWIPER
  ========================== */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach(swiperEl => {
      const configEl = swiperEl.querySelector(".swiper-config");
      if (!configEl) return;

      const config = JSON.parse(configEl.innerHTML.trim());
      new Swiper(swiperEl, config);
    });
  }

  window.addEventListener("load", initSwiper);

  /* =========================
     ISOTOPE
  ========================== */
  if (typeof Isotope !== "undefined" && typeof imagesLoaded !== "undefined") {
    document.querySelectorAll(".isotope-layout").forEach(layoutEl => {
      const container = layoutEl.querySelector(".isotope-container");
      if (!container) return;

      const layout = layoutEl.getAttribute("data-layout") || "masonry";
      const filter = layoutEl.getAttribute("data-default-filter") || "*";
      const sort = layoutEl.getAttribute("data-sort") || "original-order";

      imagesLoaded(container, () => {
        const iso = new Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });

        layoutEl.querySelectorAll(".isotope-filters li").forEach(btn => {
          btn.addEventListener("click", () => {
            layoutEl
              .querySelector(".filter-active")
              ?.classList.remove("filter-active");

            btn.classList.add("filter-active");

            iso.arrange({
              filter: btn.getAttribute("data-filter")
            });

            aosInit();
          });
        });
      });
    });
  }

})();
