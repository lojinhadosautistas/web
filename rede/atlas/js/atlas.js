/* ===============================
   SETUP
================================ */

const canvas = document.getElementById("atlas-canvas");
const ctx = canvas.getContext("2d");

const mini = document.getElementById("atlas-minimap");
const mctx = mini.getContext("2d");

function resize(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
}
window.onresize=resize; resize();

/* ===============================
   CAMERA + MEMORY
================================ */

let camX=0,camY=0,zoom=1;

const navHistory=[];
let navIndex=-1;

function pushNav(){
  navHistory.splice(navIndex+1);
  navHistory.push({camX,camY,zoom});
  navIndex++;
}

/* ===============================
   DATA MULTI LAYER
================================ */

const nodes=[
{id:1,label:"REDE",cluster:"core",x:0,y:0,size:46,layer:0,content:"Hub"},
{id:2,label:"Pesquisa",cluster:"knowledge",x:-200,y:-120,size:30,layer:1,content:"Pesquisa"},
{id:3,label:"Documentos",cluster:"knowledge",x:240,y:-100,size:30,layer:1,content:"Docs"},
{id:4,label:"Oficinas",cluster:"learning",x:-220,y:190,size:30,layer:1,content:"Oficinas"},
{id:5,label:"Cursos",cluster:"learning",x:210,y:210,size:30,layer:1,content:"Cursos"}
];

const edges=[[1,2],[1,3],[1,4],[1,5]];

const clusterColors={
core:"#2563eb",
knowledge:"#10b981",
learning:"#8b5cf6"
};

/* ===============================
   FORCE LAYOUT
================================ */

function physics(){
  nodes.forEach(a=>{
    nodes.forEach(b=>{
      if(a===b)return;
      const dx=a.x-b.x;
      const dy=a.y-b.y;
      const d=Math.hypot(dx,dy)+0.1;
      const rep=4000/(d*d);
      a.x+=dx/d*rep*0.01;
      a.y+=dy/d*rep*0.01;
    });
  });

  edges.forEach(([ai,bi])=>{
    const a=nodes.find(n=>n.id===ai);
    const b=nodes.find(n=>n.id===bi);
    const dx=b.x-a.x;
    const dy=b.y-a.y;
    a.x+=dx*0.001;
    a.y+=dy*0.001;
    b.x-=dx*0.001;
    b.y-=dy*0.001;
  });
}

/* ===============================
   HIT
================================ */

let hovered=null;

function screenToWorld(sx,sy){
  return{
    x:(sx-canvas.width/2)/zoom+camX,
    y:(sy-canvas.height/2)/zoom+camY
  }
}

canvas.onmousemove=e=>{
  const w=screenToWorld(e.clientX,e.clientY);
  hovered=null;
  nodes.forEach(n=>{
    if(Math.hypot(w.x-n.x,w.y-n.y)<n.size) hovered=n;
  });
};

/* ===============================
   SEARCH
================================ */

const search=document.getElementById("atlas-search");

search.oninput=()=>{
  const q=search.value.toLowerCase();
  const n=nodes.find(n=>n.label.toLowerCase().includes(q));
  if(n) flyTo(n.x,n.y,1.2);
};

function flyTo(x,y,z){
  pushNav();
  camX=x; camY=y; zoom=z;
}

/* ===============================
   BOOKMARK
================================ */

const bookmarks=[];

document.getElementById("bookmark-btn").onclick=()=>{
  bookmarks.push({camX,camY,zoom});
  alert("Bookmark salvo");
};

/* ===============================
   PAN + ZOOM
================================ */

let drag=false,lx,ly;

canvas.onmousedown=e=>{drag=true;lx=e.clientX;ly=e.clientY};
canvas.onmouseup=()=>drag=false;

canvas.onmousemove=e=>{
  if(drag){
    camX-=(e.clientX-lx)/zoom;
    camY-=(e.clientY-ly)/zoom;
    lx=e.clientX;ly=e.clientY;
  }
};

canvas.onwheel=e=>{
  e.preventDefault();
  zoom*=e.deltaY>0?0.9:1.1;
  zoom=Math.max(.3,Math.min(2.5,zoom));
};

/* ===============================
   DRAW
================================ */

function draw(){

  physics();

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(zoom,zoom);
  ctx.translate(-camX,-camY);

  edges.forEach(([a,b])=>{
    const n1=nodes.find(n=>n.id===a);
    const n2=nodes.find(n=>n.id===b);
    ctx.beginPath();
    ctx.moveTo(n1.x,n1.y);
    ctx.lineTo(n2.x,n2.y);
    ctx.strokeStyle="#cbd5e1";
    ctx.stroke();
  });

  nodes.forEach(n=>{
    ctx.beginPath();
    ctx.fillStyle=clusterColors[n.cluster];
    ctx.arc(n.x,n.y,n.size,0,6.28);
    ctx.fill();

    ctx.fillStyle="#111";
    ctx.textAlign="center";
    ctx.fillText(n.label,n.x,n.y+4);
  });

  ctx.restore();

  requestAnimationFrame(draw);
}
draw();
