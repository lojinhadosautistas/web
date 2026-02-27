/* =====================================
   ATLAS COGNITIVO v4 — STABLE ENGINE
===================================== */

/* =========================
   DOM
========================= */

const canvas = document.getElementById("atlas-canvas");
const ctx = canvas.getContext("2d");

const miniCanvas = document.getElementById("atlas-minimap");
const miniCtx = miniCanvas.getContext("2d");

const searchInput = document.getElementById("atlas-search");
const breadcrumbsDiv = document.getElementById("atlas-breadcrumbs");

const fragmentView = document.getElementById("fragment-view");
const fragmentTitle = document.getElementById("fragment-title");
const fragmentContent = document.getElementById("fragment-content");
const fragmentClose = document.getElementById("fragment-close");

const bookmarkBtn = document.getElementById("bookmark-btn");

/* =========================
   CANVAS
========================= */

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  miniCanvas.width = 200;
  miniCanvas.height = 140;
}
window.addEventListener("resize",resize);
resize();

/* =========================
   CAMERA
========================= */

let scale = 1;
let offsetX = canvas.width/2;
let offsetY = canvas.height/2;

let isDragging=false;
let lastX=0,lastY=0;

/* =========================
   DATA
========================= */

const nodes=[
{id:1,label:"REDE",cluster:"core",x:0,y:0,vx:0,vy:0,size:46,layer:0,content:"Hub central"},
{id:2,label:"Pesquisa",cluster:"knowledge",x:-220,y:-140,vx:0,vy:0,size:30,layer:1,content:"Pesquisa"},
{id:3,label:"Documentos",cluster:"knowledge",x:240,y:-120,vx:0,vy:0,size:30,layer:1,content:"Docs"},
{id:4,label:"Oficinas",cluster:"learning",x:-220,y:210,vx:0,vy:0,size:30,layer:1,content:"Oficinas"},
{id:5,label:"Cursos",cluster:"learning",x:210,y:210,vx:0,vy:0,size:30,layer:1,content:"Cursos"}
];

const edges=[[1,2],[1,3],[1,4],[1,5]];

const clusterColor={
core:"#2563eb",
knowledge:"#22c55e",
learning:"#a855f7"
};

/* =========================
   FORCE LAYOUT SUAVE
========================= */

let energy=1;

function physics(){

  if(energy<0.001) return;

  const repulsion=1200;
  const attract=0.002;
  const damping=0.9;

  nodes.forEach(a=>{
    nodes.forEach(b=>{
      if(a===b) return;
      const dx=a.x-b.x;
      const dy=a.y-b.y;
      const d=Math.hypot(dx,dy)+0.1;
      const f=repulsion/(d*d);
      a.vx+=(dx/d)*f*0.01;
      a.vy+=(dy/d)*f*0.01;
    });
  });

  edges.forEach(([ai,bi])=>{
    const a=nodes.find(n=>n.id===ai);
    const b=nodes.find(n=>n.id===bi);
    const dx=b.x-a.x;
    const dy=b.y-a.y;
    a.vx+=dx*attract;
    a.vy+=dy*attract;
    b.vx-=dx*attract;
    b.vy-=dy*attract;
  });

  energy=0;

  nodes.forEach(n=>{
    n.vx*=damping;
    n.vy*=damping;
    n.x+=n.vx;
    n.y+=n.vy;
    energy+=Math.abs(n.vx)+Math.abs(n.vy);
  });
}

/* =========================
   GRID INVISÍVEL
========================= */

function drawGrid(){
  const step=200;
  ctx.strokeStyle="rgba(0,0,0,0.04)";
  for(let x=-2000;x<2000;x+=step){
    ctx.beginPath();
    ctx.moveTo(x,-2000);
    ctx.lineTo(x,2000);
    ctx.stroke();
  }
  for(let y=-2000;y<2000;y+=step){
    ctx.beginPath();
    ctx.moveTo(-2000,y);
    ctx.lineTo(2000,y);
    ctx.stroke();
  }
}

/* =========================
   DRAW
========================= */

let hoverNode=null;

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(offsetX,offsetY);
  ctx.scale(scale,scale);

  drawGrid();

  // edges
  ctx.strokeStyle="rgba(0,0,0,0.15)";
  edges.forEach(([ai,bi])=>{
    const a=nodes.find(n=>n.id===ai);
    const b=nodes.find(n=>n.id===bi);
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
  });

  // nodes
  nodes.forEach(n=>{
    let r=n.size*(scale<0.6?0.75:1);

    ctx.beginPath();
    ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle=clusterColor[n.cluster];
    ctx.fill();

    if(n===hoverNode){
      ctx.lineWidth=3/scale;
      ctx.strokeStyle="#fff";
      ctx.stroke();
    }

    if(scale>0.5){
      ctx.fillStyle="#fff";
      ctx.textAlign="center";
      ctx.font=`${12/scale}px sans-serif`;
      ctx.fillText(n.label,n.x,n.y+4/scale);
    }
  });

  ctx.restore();

  drawMini();
}

/* =========================
   MINI MAP
========================= */

function drawMini(){

  miniCtx.clearRect(0,0,miniCanvas.width,miniCanvas.height);

  miniCtx.fillStyle="#fff";
  miniCtx.fillRect(0,0,miniCanvas.width,miniCanvas.height);

  miniCtx.save();
  miniCtx.translate(100,70);
  miniCtx.scale(0.1,0.1);

  edges.forEach(([ai,bi])=>{
    const a=nodes.find(n=>n.id===ai);
    const b=nodes.find(n=>n.id===bi);
    miniCtx.beginPath();
    miniCtx.moveTo(a.x,a.y);
    miniCtx.lineTo(b.x,b.y);
    miniCtx.strokeStyle="#ddd";
    miniCtx.stroke();
  });

  nodes.forEach(n=>{
    miniCtx.beginPath();
    miniCtx.arc(n.x,n.y,10,0,Math.PI*2);
    miniCtx.fillStyle=clusterColor[n.cluster];
    miniCtx.fill();
  });

  miniCtx.restore();
}

/* =========================
   HIT
========================= */

function hit(mx,my){
  const wx=(mx-offsetX)/scale;
  const wy=(my-offsetY)/scale;
  return nodes.find(n=>Math.hypot(wx-n.x,wy-n.y)<n.size);
}

/* =========================
   EVENTS
========================= */

canvas.onmousedown=e=>{
  isDragging=true;
  lastX=e.clientX;
  lastY=e.clientY;
};

canvas.onmousemove=e=>{
  const n=hit(e.offsetX,e.offsetY);
  hoverNode=n;
  canvas.style.cursor=n?"pointer":"grab";

  if(isDragging){
    offsetX+=e.clientX-lastX;
    offsetY+=e.clientY-lastY;
    lastX=e.clientX;
    lastY=e.clientY;
  }
};

canvas.onmouseup=()=>isDragging=false;
canvas.onmouseleave=()=>isDragging=false;

canvas.onclick=e=>{
  const n=hit(e.offsetX,e.offsetY);
  if(!n) return;

  fragmentTitle.textContent=n.label;
  fragmentContent.textContent=n.content;
  fragmentView.classList.add("open");

  navHistory.push(n);
  updateBreadcrumb();
};

canvas.onwheel=e=>{
  e.preventDefault();
  const wx=(e.offsetX-offsetX)/scale;
  const wy=(e.offsetY-offsetY)/scale;
  const zoom=e.deltaY<0?1.1:0.9;
  scale*=zoom;
  offsetX=e.offsetX-wx*scale;
  offsetY=e.offsetY-wy*scale;
};

/* =========================
   SEARCH
========================= */

searchInput.oninput=e=>{
  const q=e.target.value.toLowerCase();
  const n=nodes.find(n=>n.label.toLowerCase().includes(q));
  if(!n) return;
  offsetX=canvas.width/2-n.x*scale;
  offsetY=canvas.height/2-n.y*scale;
};

/* =========================
   BREADCRUMB
========================= */

const navHistory=[];

function updateBreadcrumb(){
  breadcrumbsDiv.innerHTML="";
  navHistory.slice(-4).forEach(n=>{
    const el=document.createElement("span");
    el.textContent=n.label+" › ";
    breadcrumbsDiv.appendChild(el);
  });
}

/* =========================
   BOOKMARK
========================= */

bookmarkBtn.onclick=()=>{
  localStorage.setItem("atlasBookmark",JSON.stringify({offsetX,offsetY,scale}));
};

const saved=localStorage.getItem("atlasBookmark");
if(saved){
  const s=JSON.parse(saved);
  offsetX=s.offsetX;
  offsetY=s.offsetY;
  scale=s.scale;
}

/* =========================
   FRAGMENT CLOSE
========================= */

fragmentClose.onclick=()=>fragmentView.classList.remove("open");

/* =========================
   LOOP
========================= */

function loop(){
  physics();
  draw();
  requestAnimationFrame(loop);
}
loop();
