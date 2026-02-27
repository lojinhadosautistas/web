/* =========================
   ATLAS v4 — Cognitive Engine
========================= */

const canvas = document.getElementById("atlasCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =========================
   CAMERA
========================= */

let cam = { x: 0, y: 0, zoom: 1 };
let targetCam = { x: 0, y: 0, zoom: 1 };

/* =========================
   CLUSTERS
========================= */

const clusterColor = {
  core: "#fde68a",
  knowledge: "#93c5fd",
  learning: "#86efac",
  analysis: "#fca5a5",
};

/* =========================
   DATA
========================= */

const nodes = [
  { id: 1, label: "REDE", cluster: "core", x: 0, y: 0, vx: 0, vy: 0, size: 46, layer: 0, content: "Hub central" },

  { id: 2, label: "Pesquisa", cluster: "knowledge", x: -200, y: -120, vx: 0, vy: 0, size: 30, layer: 1, content: "Base de conhecimento" },
  { id: 3, label: "Documentos", cluster: "knowledge", x: 240, y: -100, vx: 0, vy: 0, size: 30, layer: 1, content: "Repositório estruturado" },

  { id: 4, label: "Oficinas", cluster: "learning", x: -220, y: 190, vx: 0, vy: 0, size: 30, layer: 1, content: "Espaço formativo" },
  { id: 5, label: "Cursos", cluster: "learning", x: 210, y: 210, vx: 0, vy: 0, size: 30, layer: 1, content: "Ambiente educacional" },
];

const edges = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
];

/* =========================
   FORCE LAYOUT SUAVE
========================= */

let simulationEnergy = 1;

function physics() {
  if (simulationEnergy < 0.001) return;

  const repulsion = 1200;
  const attraction = 0.002;
  const damping = 0.9;

  nodes.forEach(a => {
    nodes.forEach(b => {
      if (a === b) return;

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy) + 0.1;

      const force = repulsion / (d * d);
      a.vx += (dx / d) * force * 0.01;
      a.vy += (dy / d) * force * 0.01;
    });
  });

  edges.forEach(([ai, bi]) => {
    const a = nodes.find(n => n.id === ai);
    const b = nodes.find(n => n.id === bi);

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    a.vx += dx * attraction;
    a.vy += dy * attraction;
    b.vx -= dx * attraction;
    b.vy -= dy * attraction;
  });

  simulationEnergy = 0;

  nodes.forEach(n => {
    n.vx *= damping;
    n.vy *= damping;
    n.x += n.vx;
    n.y += n.vy;
    simulationEnergy += Math.abs(n.vx) + Math.abs(n.vy);
  });
}

/* =========================
   HIT DETECTION
========================= */

let hoverNode = null;

function screenToWorld(x, y) {
  return {
    x: (x - w / 2) / cam.zoom - cam.x,
    y: (y - h / 2) / cam.zoom - cam.y,
  };
}

canvas.addEventListener("mousemove", e => {
  const p = screenToWorld(e.clientX, e.clientY);
  hoverNode = null;

  nodes.forEach(n => {
    if (Math.hypot(p.x - n.x, p.y - n.y) < n.size) hoverNode = n;
  });
});

/* =========================
   DRAG / PAN
========================= */

let dragging = false;
let last = { x: 0, y: 0 };

canvas.addEventListener("mousedown", e => {
  dragging = true;
  last = { x: e.clientX, y: e.clientY };
});

window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", e => {
  if (!dragging) return;
  cam.x += (e.clientX - last.x) / cam.zoom;
  cam.y += (e.clientY - last.y) / cam.zoom;
  last = { x: e.clientX, y: e.clientY };
});

/* =========================
   ZOOM
========================= */

canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  targetCam.zoom *= factor;
});

/* =========================
   CLICK → FRAGMENT
========================= */

canvas.addEventListener("click", () => {
  if (!hoverNode) return;
  openFragment(hoverNode);
  addBreadcrumb(hoverNode);
  saveBookmark(hoverNode);
});

function openFragment(n) {
  document.getElementById("fragmentView").classList.add("open");
  document.getElementById("fragmentTitle").textContent = n.label;
  document.getElementById("fragmentContent").textContent = n.content;
}

/* =========================
   SEARCH → ZOOM
========================= */

const search = document.getElementById("atlasSearch");
search.addEventListener("input", () => {
  const q = search.value.toLowerCase();
  const found = nodes.find(n => n.label.toLowerCase().includes(q));
  if (found) focusNode(found);
});

function focusNode(n) {
  targetCam.x = -n.x;
  targetCam.y = -n.y;
  targetCam.zoom = 1.6;
}

/* =========================
   BREADCRUMBS
========================= */

const breadcrumb = [];

function addBreadcrumb(n) {
  breadcrumb.push(n.label);
  document.getElementById("atlasBreadcrumb").textContent = breadcrumb.join(" → ");
}

/* =========================
   BOOKMARKS
========================= */

const bookmarks = JSON.parse(localStorage.getItem("atlasBookmarks") || "[]");

function saveBookmark(n) {
  if (!bookmarks.includes(n.label)) {
    bookmarks.push(n.label);
    localStorage.setItem("atlasBookmarks", JSON.stringify(bookmarks));
  }
}

/* =========================
   MINI MAP
========================= */

const mini = document.getElementById("atlasMini").getContext("2d");

function drawMini() {
  const c = mini.canvas;
  mini.clearRect(0, 0, c.width, c.height);

  nodes.forEach(n => {
    mini.beginPath();
    mini.arc(c.width / 2 + n.x * 0.05, c.height / 2 + n.y * 0.05, 3, 0, 7);
    mini.fillStyle = clusterColor[n.cluster];
    mini.fill();
  });
}

/* =========================
   DRAW
========================= */

function draw() {
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(cam.x, cam.y);

  edges.forEach(([ai, bi]) => {
    const a = nodes.find(n => n.id === ai);
    const b = nodes.find(n => n.id === bi);
    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  nodes.forEach(n => {
    const scale = hoverNode === n ? 1.06 : 1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size * scale, 0, 7);
    ctx.fillStyle = clusterColor[n.cluster];
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.font = `${14 / cam.zoom}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(n.label, n.x, n.y + 4);
  });

  ctx.restore();
}

/* =========================
   LOOP
========================= */

function loop() {
  physics();

  cam.x += (targetCam.x - cam.x) * 0.08;
  cam.y += (targetCam.y - cam.y) * 0.08;
  cam.zoom += (targetCam.zoom - cam.zoom) * 0.08;

  draw();
  drawMini();
  requestAnimationFrame(loop);
}

loop();
