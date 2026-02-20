async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(url);
  el.innerHTML = await res.text();
}

function initMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

  document.addEventListener("click", function(e) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header-container", "components/header.html");
  await loadComponent("sidebar-container", "components/sidebar.html");

  initMenuToggle();
});
