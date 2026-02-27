/* ==========================================
   MAPA COGNITIVO — SISTEMA REDE
   World Space + Pan + Zoom + Pinch + Nodes
========================================== */

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

// ----------------------------
// ESTADO GLOBAL
// ----------------------------

let scale = 1;
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let lastX = 0;
let lastY = 0;

let bgReady = false;

// ----------------------------
// IMAGEM DE FUNDO (WORLD BASE)
// ----------------------------

const bgImage = new Image();
bgImage.src = "assets/mapa-vila.webp"; // altere se necessário

bgImage.onload = () => {
  bgReady = true;
  centralizarMapa();
  render();
};

// ----------------------------
// NODES (EXEMPLO BASE)
// ----------------------------

const nodes = [
  { id: "dossie1", x: -200, y: -100, label: "Dossiê A" },
  { id: "relatorio1", x: 250, y: 120, label: "Relatório B" },
  { id: "plano1", x: 0, y: 220, label: "Plano C" }
];

// ----------------------------
// RESIZE RESPONSIVO
// ----------------------------

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

window.addEventListener("resize", () => {
  resizeCanvas();
  centralizarMapa();
  render();
});

resizeCanvas();

// ----------------------------
// CENTRALIZAÇÃO AUTOMÁTICA
// ----------------------------

function centralizarMapa() {
  if (!bgReady) return;

  const vw = canvas.width;
  const vh = canvas.height;

  const iw = bgImage.width;
  const ih = bgImage.height;

  const scaleX = vw / iw;
  const scaleY = vh / ih;

  scale = Math.min(scaleX, scaleY) * 0.9;

  offsetX = vw / 2;
  offsetY = vh / 2;
}

// ----------------------------
// RENDER PRINCIPAL
// ----------------------------

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  drawBackground();
  drawConnections();
  drawNodes();

  ctx.restore();
}

// ----------------------------
// DESENHAR FUNDO
// ----------------------------

function drawBackground() {
  if (!bgReady) return;

  const w = bgImage.width;
  const h = bgImage.height;

  ctx.drawImage(bgImage, -w / 2, -h / 2);
}

// ----------------------------
// DESENHAR NODES
// ----------------------------

function drawNodes() {
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + 5);
  });
}

// ----------------------------
// DESENHAR CONEXÕES (placeholder)
// ----------------------------

function drawConnections() {
  // exemplo simples (opcional)
  if (nodes.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  ctx.lineTo(nodes[1].x, nodes[1].y);
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ----------------------------
// PAN (MOUSE)
// ----------------------------

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  offsetX += dx;
  offsetY += dy;

  lastX = e.clientX;
  lastY = e.clientY;

  render();
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

// ----------------------------
// ZOOM COM SCROLL
// ----------------------------

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomIntensity = 0.1;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const worldX = (mouseX - offsetX) / scale;
  const worldY = (mouseY - offsetY) / scale;

  const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
  scale *= zoom;

  offsetX = mouseX - worldX * scale;
  offsetY = mouseY - worldY * scale;

  render();
});

// ----------------------------
// PINCH ZOOM (MOBILE)
// ----------------------------

let initialDistance = null;

canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }

  if (e.touches.length === 2) {
    initialDistance = getTouchDistance(e);
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();

  if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;

    offsetX += dx;
    offsetY += dy;

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;

    render();
  }

  if (e.touches.length === 2) {
    const newDistance = getTouchDistance(e);
    const zoom = newDistance / initialDistance;

    scale *= zoom;
    initialDistance = newDistance;

    render();
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  isDragging = false;
  initialDistance = null;
});

function getTouchDistance(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ----------------------------
// INICIALIZAÇÃO
// ----------------------------

render();
