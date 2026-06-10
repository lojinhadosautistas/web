
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
      <div class="component-error">
        Erro ao carregar componente.
      </div>
    `;
  }
}

function initMenuToggle() {

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener("click", (e) => {

    e.stopPropagation();

    sidebar.classList.toggle("show");

  });

  document.addEventListener("click", (e) => {

    if (
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("show");
    }

  });

}

document.addEventListener("DOMContentLoaded", async () => {

  await Promise.all([

    loadComponent(
      "header-container",
      "assets/components/continuum-header.html"
    ),

    loadComponent(
      "sidebar-container",
      "assets/components/continuum-sidebar-angelo.html"
    ),
    
    loadComponent( 
      "footer-container", 
      "assets/components/continuum-footer.html" 
    )

  ]);

  initMenuToggle();

});
