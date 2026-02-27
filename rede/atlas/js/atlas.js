/* ===============================
   SETUP
================================ */

const canvas = document.getElementById("atlas-canvas");
const ctx = canvas.getContext("2d");

const mini = document.getElementById("atlas-minimap");
const mctx = mini.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ===============================
   CAMERA
================================ */

let camX = 0;
let camY = 0;
let zoom = 1;

/* ===============================
   DATA (CANÔNICO EMBUTIDO)
================================ */

const nodes = [
  {id:1,x:0,y:0,label:"REDE",size:44,color:"#2563eb",content:"Hub central do conhecimento"},
  {id:2,x:-240,y:-120,label:"Pesquisa",size:30,color:"#10b981",content:"Módulo de pesquisa"},
  {id:3,x:260,y:-90,label:"Documentos",size:30,color:"#f59e0b",content:"Repositório"},
  {id:4,x:-210,y:190,label:"Oficinas",size:30,color:"#ef4444",content:"Atividades"},
  {id:5,x:210,y:210,label:"Cursos",size:30,color:"#8b5cf6",content:"Formações"}
];

const edges = [
  [1,2],[1,3],[1,4],[1,5]
];

/* ===============================
   GRID COGNITIVO
================================ */

function drawGrid(){
  const step = 120 * zoom;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;

  for(let x=-camX%step; x<canvas.width; x+=step){
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.stroke();
  }

  for(let y=-camY%step; y<canvas.height; y+=step){
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.stroke();
  }
}

/* ===============================
   HIT DETECTION
================================ */

let hovered = null;

function screenToWorld(sx,sy){
  return {
    x:(sx-canvas.width/2)/zoom+camX,
    y:(sy-canvas.height/2)/zoom+camY
  }
}

canvas.addEventListener("mousemove",e=>{
  const w = screenToWorld(e.clientX,e.clientY);
  hovered = null;

  nodes.forEach(n=>{
    const d = Math.hypot(w.x-n.x,w.y-n.y);
    if(d < n.size) hovered = n;
  });
});

/* ===============================
   CLICK
================================ */

const fragment = document.getElementById("fragment-view");
const fTitle = document.getElementById("fragment-title");
const fContent = document.getElementById("fragment-content");

canvas.addEventListener("click",()=>{
  if(hovered){
    fTitle.textContent = hovered.label;
    fContent.textContent = hovered.content;
    fragment.classList.add("open");
  }
});

document.getElementById("fragment-close").onclick=()=>fragment.classList.remove("open");

/* ===============================
   PAN
================================ */

let dragging=false;
let lx,ly;

canvas.onmousedown=e=>{
  dragging=true;
  lx=e.clientX;
  ly=e.clientY;
};

canvas.onmouseup=()=>dragging=false;

canvas.onmousemove=e=>{
  if(dragging){
    camX -= (e.clientX-lx)/zoom;
    camY -= (e.clientY-ly)/zoom;
    lx=e.clientX;
    ly=e.clientY;
  }
};

/* ===============================
   ZOOM + CLUSTER
================================ */

canvas.onwheel=e=>{
  e.preventDefault();
  zoom *= e.deltaY>0?0.9:1.1;
  zoom=Math.min(Math.max(zoom,0.3),2.5);
};

/* ===============================
   DRAW
================================ */

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawGrid();

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(zoom,zoom);
  ctx.translate(-camX,-camY);

  /* edges */
  ctx.strokeStyle="#cbd5e1";
  edges.forEach(([a,b])=>{
    const n1=nodes.find(n=>n.id===a);
    const n2=nodes.find(n=>n.id===b);
    ctx.beginPath();
    ctx.moveTo(n1.x,n1.y);
    ctx.lineTo(n2.x,n2.y);
    ctx.stroke();
  });

  /* nodes */
  nodes.forEach(n=>{
    const cluster = zoom < 0.6;

    ctx.beginPath();
    ctx.fillStyle = cluster ? "#94a3b8" : n.color;
    ctx.arc(n.x,n.y,cluster?12:n.size,0,Math.PI*2);
    ctx.fill();

    if(!cluster){
      ctx.fillStyle="#111";
      ctx.textAlign="center";
      ctx.fillText(n.label,n.x,n.y+4);
    }

    if(hovered===n){
      ctx.beginPath();
      ctx.strokeStyle="#000";
      ctx.arc(n.x,n.y,n.size+4,0,Math.PI*2);
      ctx.stroke();
    }
  });

  ctx.restore();

  drawMini();

  requestAnimationFrame(draw);
}

draw();

/* ===============================
   MINI MAP
================================ */

function drawMini(){
  mctx.clearRect(0,0,mini.width,mini.height);

  const scale=0.18;

  nodes.forEach(n=>{
    mctx.beginPath();
    mctx.fillStyle=n.color;
    mctx.arc(mini.width/2+n.x*scale,mini.height/2+n.y*scale,4,0,6.28);
    mctx.fill();
  });

  mctx.strokeRect(
    mini.width/2-camX*scale-(canvas.width/2)*scale/zoom,
    mini.height/2-camY*scale-(canvas.height/2)*scale/zoom,
    canvas.width*scale/zoom,
    canvas.height*scale/zoom
  );
}
