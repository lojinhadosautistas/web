/* ======================================
   ATLAS v4 — Inteligência Cognitiva Real
   DOM driven (repoTable)
====================================== */

const canvas = document.getElementById("atlas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let selectedNode = null;
let hoverNode = null;
let navHistory = [];

let zoom = 1;
let offsetX = 0;
let offsetY = 0;

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

/* ======================================
   1️⃣ LER TABELA → NODES
====================================== */

function buildNodesFromTable() {
  const rows = document.querySelectorAll("#repoTable tbody tr");

  const categoryCenters = {};
  const categories = [...new Set([...rows].map(r => r.querySelector(".repo-category")?.textContent.trim()))];

  // Distribuição circular macro clusters
  const radius = Math.min(canvas.width, canvas.height) * 0.35;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  categories.forEach((cat, i) => {
    const angle = (i / categories.length) * Math.PI * 2;
    categoryCenters[cat] = {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    };
  });

  rows.forEach((row, i) => {
    const title = row.querySelector(".repo-title")?.textContent.trim() || "item";
    const category = row.querySelector(".repo-category")?.textContent.trim() || "geral";
    const tags = row.querySelector(".repo-tags")?.textContent.split(",").map(t => t.trim()) || [];

    const center = categoryCenters[category] || { x: cx, y: cy };

    nodes.push({
      id: i,
      label: title,
      category,
      tags,
      x: center.x + (Math.random() - 0.5) * 80,
      y: center.y + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
      size: 6,
      baseSize: 6
    });
  });

  // Edges por categoria
  nodes.forEach(a => {
    nodes.forEach(b => {
      if (a !== b && a.category === b.category) {
        edges.push({ a, b });
      }
    });
  });
}

buildNodesFromTable();

/* ======================================
   2️⃣ FORCE LAYOUT SUAVE
====================================== */

function physics() {
  nodes.forEach(n => {
    n.vx *= 0.92;
    n.vy *= 0.92;
  });

  // repulsão
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;

      const force = 80 / dist;

      a.vx -= (dx / dist) * force;
      a.vy -= (dy / dist) * force;
      b.vx += (dx / dist) * force;
      b.vy += (dy / dist) * force;
    }
  }

  // atração cluster
  edges.forEach(e => {
    const dx = e.b.x - e.a.x;
    const dy = e.b.y - e.a.y;

    e.a.vx += dx * 0.0008;
    e.a.vy += dy * 0.0008;
    e.b.vx -= dx * 0.0008;
    e.b.vy -= dy * 0.0008;
  });

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
  });
}

/* ======================================
   3️⃣ CORES SEMÂNTICAS
====================================== */

const palette = {};
function getColor(cat) {
  if (!palette[cat]) {
    const hue = Math.random() * 360;
    palette[cat] = `hsl(${hue},70%,55%)`;
  }
  return palette[cat];
}

/* ======================================
   4️⃣ DRAW
====================================== */

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  // edges
  ctx.globalAlpha = 0.08;
  edges.forEach(e => {
    ctx.beginPath();
    ctx.moveTo(e.a.x, e.a.y);
    ctx.lineTo(e.b.x, e.b.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;

  // nodes
  nodes.forEach(n => {
    const targetSize =
      selectedNode === n ? 14 :
      hoverNode === n ? 9 :
      n.baseSize;

    // encolhimento discreto
    n.size += (targetSize - n.size) * 0.15;

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
    ctx.fillStyle = getColor(n.category);
    ctx.fill();
  });

  ctx.restore();
}

/* ======================================
   5️⃣ HIT TEST
====================================== */

function getNode(mx, my) {
  const x = (mx - offsetX) / zoom;
  const y = (my - offsetY) / zoom;

  return nodes.find(n => Math.hypot(n.x - x, n.y - y) < 10);
}

/* ======================================
   6️⃣ INTERAÇÃO
====================================== */

canvas.addEventListener("mousemove", e => {
  hoverNode = getNode(e.offsetX, e.offsetY);
});

canvas.addEventListener("click", e => {
  const n = getNode(e.offsetX, e.offsetY);
  if (n) {
    selectedNode = n;
    navHistory.push(n);
    zoomToNode(n);
    updateBreadcrumb();
  }
});

/* ======================================
   7️⃣ SEARCH → ZOOM
====================================== */

window.atlasSearch = function(term) {
  const n = nodes.find(n => n.label.toLowerCase().includes(term.toLowerCase()));
  if (n) {
    selectedNode = n;
    zoomToNode(n);
    navHistory.push(n);
    updateBreadcrumb();
  }
};

function zoomToNode(n) {
  zoom = 2;
  offsetX = canvas.width / 2 - n.x * zoom;
  offsetY = canvas.height / 2 - n.y * zoom;
}

/* ======================================
   8️⃣ BREADCRUMB
====================================== */

function updateBreadcrumb() {
  const bc = document.getElementById("atlasBreadcrumb");
  if (!bc) return;

  bc.innerHTML = navHistory.map(n => n.label).join(" → ");
}

/* ======================================
   LOOP
====================================== */

function loop() {
  physics();
  draw();
  requestAnimationFrame(loop);
}

loop();
