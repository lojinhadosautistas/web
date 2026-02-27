/* ================================
   ATLAS COGNITIVO v4.2 — MODERN STABLE
================================ */

const canvas = document.getElementById("atlas-canvas");
const ctx = canvas.getContext("2d");

const minimap = document.getElementById("atlas-minimap");
const mctx = minimap.getContext("2d");

const searchInput = document.getElementById("atlas-search");
const breadcrumbs = document.getElementById("atlas-breadcrumbs");

const fragmentView = document.getElementById("fragment-view");
const fragmentTitle = document.getElementById("fragment-title");
const fragmentContent = document.getElementById("fragment-content");
const fragmentClose = document.getElementById("fragment-close");

/* ================================
   SIZE
================================ */

let W,H;
function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
  minimap.width=220;
  minimap.height=140;
}
window.addEventListener("resize",resize);
resize();

/* ================================
   STATE
================================ */

let nodes=[];
let edges=[];

let hovered=null;
let selected=null;

let camera={x:0,y:0,zoom:1};
let targetCamera={x:0,y:0,zoom:1};

let navStack=[];

/* ================================
   READ TABLE
================================ */

function readRepository(){

  const table=document.getElementById("repoTable");
  if(!table) return;

  const rows=[...table.querySelectorAll("tbody tr")];

  nodes=rows.map((row,i)=>{

    const cols=row.querySelectorAll("td");

    return{
      id:i,
      label:cols[0]?.innerText||"Node",
      cluster:cols[1]?.innerText||"default",
      content:row.innerHTML,

      x:(Math.random()-0.5)*1200,
      y:(Math.random()-0.5)*900,
      vx:0,
      vy:0,
      r:24,
      hover:0
    }
  });

  edges=[];
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      if(nodes[i].cluster===nodes[j].cluster){
        edges.push([i,j]);
      }
    }
  }
}

readRepository();

/* ================================
   COLORS
================================ */

const palette=["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#a855f7"];

function colorForCluster(name){
  let hash=0;
  for(let i=0;i<name.length;i++) hash=name.charCodeAt(i)+((hash<<5)-hash);
  return palette[Math.abs(hash)%palette.length];
}

/* ================================
   PHYSICS — ULTRA STABLE
================================ */

function step(){

  const repel=11000;
  const spring=0.00014;
  const damping=0.86;
  const cutoff=320;
  const maxSpeed=0.16;

  for(let i=0;i<nodes.length;i++){
    const a=nodes[i];

    for(let j=i+1;j<nodes.length;j++){

      const b=nodes[j];

      let dx=b.x-a.x;
      let dy=b.y-a.y;

      let d=Math.hypot(dx,dy);
      if(d>cutoff) continue;
      if(!d) d=1;

      const f=repel/(d*d);

      dx/=d; dy/=d;

      a.vx-=dx*f;
      a.vy-=dy*f;
      b.vx+=dx*f;
      b.vy+=dy*f;
    }
  }

  edges.forEach(([ai,bi])=>{
    const a=nodes[ai];
    const b=nodes[bi];

    let dx=b.x-a.x;
    let dy=b.y-a.y;
    let d=Math.hypot(dx,dy)||1;

    const f=(d-260)*spring;

    dx/=d; dy/=d;

    a.vx+=dx*f;
    a.vy+=dy*f;
    b.vx-=dx*f;
    b.vy-=dy*f;
  });

  nodes.forEach(n=>{

    const speed=Math.hypot(n.vx,n.vy);
    if(speed<0.002){ n.vx=0; n.vy=0; }

    if(speed>maxSpeed){
      n.vx*=maxSpeed/speed;
      n.vy*=maxSpeed/speed;
    }

    n.vx*=damping;
    n.vy*=damping;

    n.x+=n.vx;
    n.y+=n.vy;

    n.hover+=( (n===hovered?1:0)-n.hover)*0.18;
  });
}

/* ================================
   CAMERA
================================ */

function updateCamera(){

  targetCamera.zoom=Math.max(0.35,Math.min(2.4,targetCamera.zoom));

  camera.x+=(targetCamera.x-camera.x)*0.08;
  camera.y+=(targetCamera.y-camera.y)*0.08;
  camera.zoom+=(targetCamera.zoom-camera.zoom)*0.08;
}

/* ================================
   DRAW
================================ */

function draw(){

  ctx.clearRect(0,0,W,H);

  ctx.save();
  ctx.translate(W/2,H/2);
  ctx.scale(camera.zoom,camera.zoom);
  ctx.translate(-camera.x,-camera.y);

  ctx.lineWidth=1;

  edges.forEach(([ai,bi])=>{
    const a=nodes[ai];
    const b=nodes[bi];
    ctx.strokeStyle="rgba(0,0,0,0.06)";
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();
  });

  nodes.forEach(n=>{

    const r=n.r*(1+n.hover*0.15);

    ctx.beginPath();
    ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle=colorForCluster(n.cluster);
    ctx.globalAlpha=n===selected?1:0.92;
    ctx.fill();
    ctx.globalAlpha=1;

    ctx.fillStyle="#111";
    ctx.font="12px Inter, sans-serif";
    ctx.textAlign="center";
    ctx.textBaseline="top";
    ctx.fillText(n.label,n.x,n.y+r+6);
  });

  ctx.restore();

  drawMinimap();
}

/* ================================
   MINIMAP
================================ */

function drawMinimap(){

  mctx.clearRect(0,0,minimap.width,minimap.height);

  const scale=0.07;

  nodes.forEach(n=>{
    mctx.fillStyle=colorForCluster(n.cluster);
    mctx.fillRect(minimap.width/2+n.x*scale,minimap.height/2+n.y*scale,4,4);
  });
}

/* ================================
   HIT
================================ */

function screenToWorld(x,y){
  return{
    x:(x-W/2)/camera.zoom+camera.x,
    y:(y-H/2)/camera.zoom+camera.y
  }
}

canvas.onmousemove=e=>{
  const p=screenToWorld(e.clientX,e.clientY);

  let best=null;
  let bestD=999;

  nodes.forEach(n=>{
    const d=Math.hypot(n.x-p.x,n.y-p.y);
    if(d<n.r+8 && d<bestD){
      best=n;
      bestD=d;
    }
  });

  hovered=best;
};

canvas.onclick=()=>{
  if(!hovered) return;

  selected=hovered;
  navStack.push(selected);
  breadcrumbs.innerHTML=navStack.map(n=>n.label).join(" → ");

  fragmentTitle.innerText=selected.label;
  fragmentContent.innerHTML=selected.content;
  fragmentView.classList.add("open");
};

fragmentClose.onclick=()=>fragmentView.classList.remove("open");

/* ================================
   SEARCH
================================ */

searchInput.oninput=()=>{
  const q=searchInput.value.toLowerCase();
  const found=nodes.find(n=>n.label.toLowerCase().includes(q));

  if(found){
    targetCamera.x=found.x;
    targetCamera.y=found.y;
    targetCamera.zoom=1.7;
  }
};

/* ================================
   PAN + ZOOM
================================ */

let dragging=false;
let last={x:0,y:0};

canvas.onmousedown=e=>{
  dragging=true;
  last={x:e.clientX,y:e.clientY};
};

window.onmouseup=()=>dragging=false;

window.onmousemove=e=>{
  if(!dragging) return;

  const dx=(e.clientX-last.x)/camera.zoom;
  const dy=(e.clientY-last.y)/camera.zoom;

  targetCamera.x-=dx;
  targetCamera.y-=dy;

  last={x:e.clientX,y:e.clientY};
};

canvas.onwheel=e=>{
  targetCamera.zoom*=e.deltaY>0?0.92:1.08;
};

/* ================================
   LOOP
================================ */

function loop(){
  step();
  updateCamera();
  draw();
  requestAnimationFrame(loop);
}
loop();
