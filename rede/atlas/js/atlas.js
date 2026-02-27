/* =========================
   ATLAS v4 — Stable Edition
========================= */

const canvas = document.getElementById("atlasCanvas");
const ctx = canvas.getContext("2d");

/* =========================
   CANVAS FULLSCREEN FIX
========================= */

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =========================
   CAMERA (SAFE DEFAULTS)
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
};

/* =========================
   DATA
========================= */

const nodes = [
  { id: 1, label: "REDE", cluster: "core", x: 0, y: 0, vx: 0, vy: 0, size: 44 },

  { id: 2, label: "Pesquisa", cluster: "knowledge", x: -240, y: -120, vx: 0, vy: 0, size: 30 },
  { id: 3, label: "Documentos", cluster: "knowledge", x: 240, y: -120, vx: 0, vy: 0, size: 30 },

  { id: 4, label: "Oficinas", cluster: "learning", x: -220, y: 200, vx: 0, vy: 0, size: 30 },
  { id: 5, label: "Cursos", cluster: "learning", x: 220, y: 200, vx: 0, vy: 0, size: 30 },
];

const edges = [
  [1,2],[1,3],[1,4],[1,5]
];

/* =========================
   FORCE LAYOUT SUAVE
========================= */

let simulationEnergy = 1;

function physics() {
  if (simulationEnergy < 0.001) return;

  const repulsion = 1200;
  const attraction = 0.002;
  const damping = 0.92;

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

  edges.forEach(([ai,bi])=>{
    const a = nodes.find(n=>n.id===ai);
    const b = nodes.find(n=>n.id===bi);

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    a.vx += dx * attraction;
    a.vy += dy * attraction;

    b.vx -= dx * attraction;
    b.vy -= dy * attraction;
  });

  simulationEnergy = 0;

  nodes.forEach(n=>{
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

function screenToWorld(x,y){
  return {
    x: (x - canvas.width/2)/cam.zoom - cam.x,
    y: (y - canvas.height/2)/cam.zoom - cam.y
  }
}

canvas.addEventListener("mousemove", e=>{
  const p = screenToWorld(e.clientX, e.clientY);
  hoverNode = null;

  nodes.forEach(n=>{
    if(Math.hypot(p.x-n.x,p.y-n.y) < n.size)
      hoverNode = n;
  });
});

/* =========================
   PAN
========================= */

let dragging=false;
let last={x:0,y:0};

canvas.addEventListener("mousedown",e=>{
  dragging=true;
  last={x:e.clientX,y:e.clientY};
});

window.addEventListener("mouseup",()=>dragging=false);

window.addEventListener("mousemove",e=>{
  if(!dragging) return;

  cam.x += (e.clientX-last.x)/cam.zoom;
  cam.y += (e.clientY-last.y)/cam.zoom;

  last={x:e.clientX,y:e.clientY};
});

/* =========================
   SAFE ZOOM (LIMITED)
========================= */

canvas.addEventListener("wheel",e=>{
  e.preventDefault();
  const factor = e.deltaY>0?0.9:1.1;
  targetCam.zoom *= factor;

  // LIMITES IMPORTANTES
  targetCam.zoom = Math.max(0.4, Math.min(2.5, targetCam.zoom));
});

/* =========================
   DRAW
========================= */

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();

  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(cam.zoom,cam.zoom);
  ctx.translate(cam.x,cam.y);

  // edges
  edges.forEach(([ai,bi])=>{
    const a = nodes.find(n=>n.id===ai);
    const b = nodes.find(n=>n.id===bi);

    ctx.strokeStyle="#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
  });

  // nodes
  nodes.forEach(n=>{
    const scale = hoverNode===n?1.05:1;

    ctx.beginPath();
    ctx.arc(n.x,n.y,n.size*scale,0,Math.PI*2);
    ctx.fillStyle=clusterColor[n.cluster];
    ctx.fill();

    ctx.fillStyle="#111";
    ctx.font=`${14/cam.zoom}px sans-serif`;
    ctx.textAlign="center";
    ctx.fillText(n.label,n.x,n.y+4);
  });

  ctx.restore();
}

/* =========================
   LOOP
========================= */

function loop(){

  physics();

  cam.x += (targetCam.x-cam.x)*0.08;
  cam.y += (targetCam.y-cam.y)*0.08;
  cam.zoom += (targetCam.zoom-cam.zoom)*0.08;

  draw();

  requestAnimationFrame(loop);
}

loop();
