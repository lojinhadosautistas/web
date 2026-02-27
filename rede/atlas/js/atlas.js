/* ======================================
   ATLAS ENGINE — Sistema REDE
====================================== */

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const mini = document.getElementById("miniMap");
const miniCtx = mini.getContext("2d");

const fragment = document.getElementById("fragment-view");

/* ---------------- STATE ---------------- */

let scale = 1;
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let lastX = 0;
let lastY = 0;

let hoveredNode = null;

/* ---------------- WORLD BG ---------------- */

const bgImage = new Image();
bgImage.src = "assets/mapa-vila.webp";

let bgReady = false;

bgImage.onload = () => {
  bgReady = true;
  centralizar();
  render();
};

/* ---------------- DATA ---------------- */

const nodes = [
  { id:"1", x:-200, y:-100, label:"Dossiê", content:"Conteúdo do Dossiê" },
  { id:"2", x:250, y:120, label:"Relatório", content:"Conteúdo do Relatório" },
  { id:"3", x:0, y:220, label:"Plano", content:"Conteúdo do Plano" }
];

/* ---------------- RESIZE ---------------- */

function resize(){
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  mini.width = mini.clientWidth;
  mini.height = mini.clientHeight;
}
window.addEventListener("resize", ()=>{resize(); render();});
resize();

/* ---------------- WORLD UTILS ---------------- */

function screenToWorld(x,y){
  return {
    x:(x-offsetX)/scale,
    y:(y-offsetY)/scale
  }
}

/* ---------------- CENTER ---------------- */

function centralizar(){
  if(!bgReady) return;
  scale = Math.min(canvas.width/bgImage.width, canvas.height/bgImage.height)*0.9;
  offsetX = canvas.width/2;
  offsetY = canvas.height/2;
}

/* ---------------- GRID ---------------- */

function drawGrid(){
  const size = 200;
  ctx.strokeStyle="rgba(0,0,0,0.05)";
  ctx.lineWidth=1;

  for(let x=-2000;x<2000;x+=size){
    ctx.beginPath();
    ctx.moveTo(x,-2000);
    ctx.lineTo(x,2000);
    ctx.stroke();
  }

  for(let y=-2000;y<2000;y+=size){
    ctx.beginPath();
    ctx.moveTo(-2000,y);
    ctx.lineTo(2000,y);
    ctx.stroke();
  }
}

/* ---------------- CLUSTER ---------------- */

function getVisibleNodes(){
  if(scale>0.6) return nodes;

  const cluster = {};
  nodes.forEach(n=>{
    const key=Math.round(n.x/400)+"_"+Math.round(n.y/400);
    if(!cluster[key]) cluster[key]=[];
    cluster[key].push(n);
  });

  return Object.values(cluster).map(group=>{
    if(group.length===1) return group[0];

    const x=group.reduce((s,n)=>s+n.x,0)/group.length;
    const y=group.reduce((s,n)=>s+n.y,0)/group.length;
    return {x,y,label:group.length+" docs",cluster:true};
  });
}

/* ---------------- DRAW ---------------- */

function drawNodes(){
  const list=getVisibleNodes();

  list.forEach(n=>{
    const r=n.cluster?40:28;

    ctx.beginPath();
    ctx.arc(n.x,n.y,r,0,Math.PI*2);

    ctx.fillStyle = n===hoveredNode ? "#ef4444" : "#2563eb";
    ctx.fill();

    ctx.fillStyle="#fff";
    ctx.textAlign="center";
    ctx.fillText(n.label,n.x,n.y+4);
  });
}

/* ---------------- MINI MAP ---------------- */

function drawMini(){
  miniCtx.clearRect(0,0,mini.width,mini.height);
  miniCtx.fillStyle="#e5e7eb";
  miniCtx.fillRect(0,0,mini.width,mini.height);

  const s=mini.width/bgImage.width;

  nodes.forEach(n=>{
    miniCtx.fillStyle="#2563eb";
    miniCtx.fillRect(n.x*s+mini.width/2,n.y*s+mini.height/2,4,4);
  });

  miniCtx.strokeStyle="red";
  miniCtx.strokeRect(
    ( -offsetX/scale )*s+mini.width/2,
    ( -offsetY/scale )*s+mini.height/2,
    canvas.width/scale*s,
    canvas.height/scale*s
  );
}

/* ---------------- RENDER ---------------- */

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(offsetX,offsetY);
  ctx.scale(scale,scale);

  if(bgReady) ctx.drawImage(bgImage,-bgImage.width/2,-bgImage.height/2);

  drawGrid();
  drawNodes();

  ctx.restore();

  drawMini();
}

/* ---------------- HIT ---------------- */

function detectNode(wx,wy){
  return nodes.find(n=>{
    const dx=n.x-wx;
    const dy=n.y-wy;
    return Math.sqrt(dx*dx+dy*dy)<30;
  });
}

/* ---------------- EVENTS ---------------- */

canvas.addEventListener("mousedown",e=>{
  isDragging=true;
  canvas.classList.add("dragging");
  lastX=e.clientX;
  lastY=e.clientY;
});

canvas.addEventListener("mousemove",e=>{
  const w=screenToWorld(e.offsetX,e.offsetY);
  hoveredNode=detectNode(w.x,w.y);

  if(isDragging){
    offsetX+=e.clientX-lastX;
    offsetY+=e.clientY-lastY;
    lastX=e.clientX;
    lastY=e.clientY;
  }

  render();
});

canvas.addEventListener("mouseup",()=>{
  isDragging=false;
  canvas.classList.remove("dragging");
});

canvas.addEventListener("click",e=>{
  const w=screenToWorld(e.offsetX,e.offsetY);
  const node=detectNode(w.x,w.y);

  if(node){
    fragment.style.display="block";
    fragment.innerHTML=`<h5>${node.label}</h5><p>${node.content}</p>`;
  }
});

canvas.addEventListener("wheel",e=>{
  e.preventDefault();

  const zoom=e.deltaY<0?1.1:0.9;

  const wx=(e.offsetX-offsetX)/scale;
  const wy=(e.offsetY-offsetY)/scale;

  scale*=zoom;

  offsetX=e.offsetX-wx*scale;
  offsetY=e.offsetY-wy*scale;

  render();
},{passive:false});

render();
