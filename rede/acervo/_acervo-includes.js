document.addEventListener("DOMContentLoaded", async () => {

  const includes = document.querySelectorAll("[data-acervo-include]");

  for (const el of includes) {

    const file = el.getAttribute("data-acervo-include");

    try {
      const response = await fetch(file);
      const html = await response.text();
      el.innerHTML = html;
    } catch (e) {
      console.warn("Erro ao carregar include:", file);
      el.innerHTML = "<small>⚠ componente indisponível</small>";
    }

  }

});
