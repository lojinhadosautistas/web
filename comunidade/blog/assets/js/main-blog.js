/**
 * blog-main.js
 * Sistema de inicialização do Blog
 * Compatível com Bocor + Componentes Dinâmicos
 */

"use strict";

/* =====================================================
 * UTIL
 * ===================================================== */

function debounce(func, wait = 100) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/* =====================================================
 * COMPONENTES
 * ===================================================== */

async function loadComponent(id, url) {

  const container = document.getElementById(id);

  if (!container) {
    console.warn(`Container não encontrado: ${id}`);
    return;
  }

  try {

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${url}`);
    }

    container.innerHTML = await response.text();

  } catch (error) {

    console.error(`Falha ao carregar ${url}`, error);

    container.innerHTML = `
      <div class="alert alert-warning">
        Erro ao carregar componente.
      </div>
    `;
  }

}

/* =====================================================
 * MENU MOBILE
 * ===================================================== */

function initMobileMenu() {

  const btn = document.querySelector(".mobile-nav-toggle");

  if (!btn) return;

  btn.addEventListener("click", () => {

    document.body.classList.toggle("mobile-nav-active");

    btn.classList.toggle("bi-list");
    btn.classList.toggle("bi-x");

  });

  document.querySelectorAll("#navmenu a").forEach(link => {

    link.addEventListener("click", () => {

      document.body.classList.remove("mobile-nav-active");

      btn.classList.add("bi-list");
      btn.classList.remove("bi-x");

    });

  });

}

/* =====================================================
 * SCROLLED HEADER
 * ===================================================== */

function initScrolledHeader() {

  const header = document.querySelector("#header");

  if (!header) return;

  const updateHeader = () => {

    if (window.scrollY > 100) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }

  };

  updateHeader();

  window.addEventListener(
    "scroll",
    debounce(updateHeader, 20)
  );

}

/* =====================================================
 * SCROLL TOP
 * ===================================================== */

function initScrollTop() {

  const scrollTop = document.querySelector("#scroll-top");

  if (!scrollTop) return;

  const toggle = () => {

    if (window.scrollY > 100) {
      scrollTop.classList.add("active");
    } else {
      scrollTop.classList.remove("active");
    }

  };

  toggle();

  window.addEventListener(
    "scroll",
    debounce(toggle, 20)
  );

  scrollTop.addEventListener("click", (e) => {

    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

}

/* =====================================================
 * PRELOADER
 * ===================================================== */

function removePreloader() {

  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  preloader.classList.add("fade-out");

  setTimeout(() => {
    preloader.remove();
  }, 300);

}

/* =====================================================
 * AOS
 * ===================================================== */

function initAOS() {

  if (typeof AOS === "undefined") return;

  AOS.init({
    duration: 700,
    easing: "ease-in-out",
    once: true,
    mirror: false
  });

}

/* =====================================================
 * GLIGHTBOX
 * ===================================================== */

function initGlightbox() {

  if (typeof GLightbox === "undefined") return;

  GLightbox({
    selector: ".glightbox"
  });

}

/* =====================================================
 * SWIPER
 * ===================================================== */

function initSwiper() {

  if (typeof Swiper === "undefined") return;

  document.querySelectorAll(".init-swiper").forEach(swiperElement => {

    const configElement =
      swiperElement.querySelector(".swiper-config");

    if (!configElement) return;

    const config =
      JSON.parse(configElement.innerHTML.trim());

    new Swiper(swiperElement, config);

  });

}

/* =====================================================
 * BLOG INIT
 * ===================================================== */

async function initializeBlog() {

  try {

    await Promise.all([

      loadComponent(
        "header-container",
        "../../assets/components/header.html"
      ),

      loadComponent(
        "sidebar-container",
        "../../assets/components/sidebar-blog.html"
      ),

      loadComponent(
        "footer-container",
        "../../assets/components/footer.html"
      )

    ]);

    initMobileMenu();

    initScrolledHeader();

    initScrollTop();

    initAOS();

    initGlightbox();

    initSwiper();

    removePreloader();

    console.log(
      "✅ Blog inicializado com sucesso"
    );

  } catch (error) {

    console.error(
      "Erro ao inicializar blog:",
      error
    );

    removePreloader();

  }

}

/* =====================================================
 * START
 * ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initializeBlog
);
