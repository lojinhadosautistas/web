// ELEMENTS
const map = document.getElementById('map');
const player = document.getElementById('player');
const fragmentView = document.getElementById('fragment-view');
const svg = document.getElementById('connections');
const container = document.getElementById('atlas-container');

// STATE
let pos = { x: 1000, y: 600 };
const speed = 10;
const threshold = 140;

let docsData = [];
let manifestConnections = [];
let activeDoc = null;

// camera
let scale = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let pinchStartDist = null;
let startScale = 1;
let userCameraOverride = false;

// INIT
async function initAtlas() {
  const res = await fetch('../acervo/manifest.json');
  const manifest = await res.json();

  docsData = manifest.documents || manifest;
  manifestConnections = manifest.connections || [];

  createDocsClustered(docsData);
  updatePlayer();
  updateRadar();

  setTimeout(centerOnPlayer, 80);

  requestAnimationFrame(loopConnections);
}
window.addEventListener('load', initAtlas);

// CLUSTERS
function createDocsClustered(data) {

  const clusters = {};
  data.forEach(doc=>{
    const key = doc.cluster || doc.type || 'default';
    if(!clusters[key]) clusters[key]=[];
    clusters[key].push(doc);
  });

  const keys = Object.keys(clusters);
  const centerX = 1000;
  const centerY = 600;
  const radius = 400;

  keys.forEach((key,cIndex)=>{
    const angle=(cIndex/keys.length)*Math.PI*2;
    const cx=centerX+Math.cos(angle)*radius;
    const cy=centerY+Math.sin(angle)*radius;

    clusters[key].forEach((doc,i)=>{
      const spread=140;
      const a=(i/clusters[key].length)*Math.PI*2;
      const dx=cx+Math.cos(a)*spread;
      const dy=cy+Math.sin(a)*spread;

      const el=document.createElement('div');
      el.classList.add('doc');
      if(doc.type) el.classList.add(doc.type);

      el.dataset.id=doc.id;
      el.dataset.fragment=doc.fragment?`../acervo/fragments/${doc.fragment}`:`../acervo/fragments/frag-${doc.id}.html`;
      el.style.left=dx+'px';
      el.style.top=dy+'px';
      el.title=doc.title||doc.id;

      map.appendChild(el);
    });
  });
}

// PLAYER
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp') pos.y-=speed;
  if(e.key==='ArrowDown') pos.y+=speed;
  if(e.key==='ArrowLeft') pos.x-=speed;
  if(e.key==='ArrowRight') pos.x+=speed;
  updatePlayer(); checkProximity();
});

function updatePlayer(){
  player.style.transform=`translate(${pos.x}px,${pos.y}px)`;
  if(!userCameraOverride) centerOnPlayer();
}

// RADAR
const radar=document.createElement('div');
radar.id='radar';
map.appendChild(radar);

function updateRadar(){
  radar.style.transform=`translate(${pos.x-threshold}px,${pos.y-threshold}px)`;
  radar.style.width=threshold*2+'px';
  radar.style.height=threshold*2+'px';
}

// PROXIMITY
function checkProximity(){
  const docs=document.querySelectorAll('.doc');
  let found=false;

  docs.forEach(doc=>{
    const dist=Math.hypot(doc.offsetLeft-pos.x,doc.offsetTop-pos.y);
    if(dist<threshold){
      found=true;
      doc.classList.add('near');
      if(activeDoc!==doc){
        activeDoc=doc;
        loadFragment(doc.dataset.fragment);
      }
    }else doc.classList.remove('near');
  });

  if(!found && activeDoc){
    fragmentView.style.display='none';
    fragmentView.innerHTML='';
    activeDoc=null;
  }
  updateRadar();
}

// FRAGMENT
async function loadFragment(url){
  if(fragmentView.dataset.loaded===url) return;
  try{
    const res=await fetch(url);
    fragmentView.innerHTML=await res.text();
    fragmentView.style.display='block';
    fragmentView.dataset.loaded=url;
  }catch{
    fragmentView.innerHTML='<p>Fragment não encontrado</p>';
    fragmentView.style.display='block';
  }
}

// CONNECTIONS
function loopConnections(){ drawConnectionsLive(); requestAnimationFrame(loopConnections); }

function worldToScreen(x,y){
  return {x:x*scale+panX+20*scale,y:y*scale+panY+20*scale};
}

function drawConnectionsLive(){
  svg.innerHTML='';
  manifestConnections.forEach(pair=>{
    const aEl=document.querySelector(`[data-id="${pair[0]}"]`);
    const bEl=document.querySelector(`[data-id="${pair[1]}"]`);
    if(!aEl||!bEl) return;

    const distA=Math.hypot(aEl.offsetLeft-pos.x,aEl.offsetTop-pos.y);
    const distB=Math.hypot(bEl.offsetLeft-pos.x,bEl.offsetTop-pos.y);
    if(distA>threshold*2 && distB>threshold*2) return;

    const a=worldToScreen(aEl.offsetLeft,aEl.offsetTop);
    const b=worldToScreen(bEl.offsetLeft,bEl.offsetTop);

    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',a.x); line.setAttribute('y1',a.y);
    line.setAttribute('x2',b.x); line.setAttribute('y2',b.y);
    line.setAttribute('stroke','#64748b'); line.setAttribute('stroke-width','2');
    svg.appendChild(line);
  });
}

// CAMERA
function applyCamera(){ map.style.transform=`translate(${panX}px,${panY}px) scale(${scale})`; }

function centerOnPlayer(){
  const rect=container.getBoundingClientRect();
  panX=rect.width/2-pos.x*scale-20*scale;
  panY=rect.height/2-pos.y*scale-20*scale;
  applyCamera();
}

// INPUT CAMERA
container.addEventListener('mousedown',e=>{
  isDragging=true; userCameraOverride=true;
  startX=e.clientX-panX; startY=e.clientY-panY;
});
window.addEventListener('mousemove',e=>{
  if(!isDragging) return;
  panX=e.clientX-startX; panY=e.clientY-startY; applyCamera();
});
window.addEventListener('mouseup',()=>isDragging=false);

container.addEventListener('touchstart',e=>{
  userCameraOverride=true;
  if(e.touches.length===1){isDragging=true;startX=e.touches[0].clientX-panX;startY=e.touches[0].clientY-panY;}
  if(e.touches.length===2){pinchStartDist=getPinchDistance(e);startScale=scale;}
},{passive:false});

container.addEventListener('touchmove',e=>{
  if(isDragging && e.touches.length===1){
    panX=e.touches[0].clientX-startX; panY=e.touches[0].clientY-startY; applyCamera();
  }
  if(e.touches.length===2){
    const factor=getPinchDistance(e)/pinchStartDist;
    scale=Math.max(.5,Math.min(2.2,startScale*factor));
    applyCamera();
  }
},{passive:false});

container.addEventListener('touchend',()=>{isDragging=false;pinchStartDist=null;});

function getPinchDistance(e){
  return Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
}

setInterval(checkProximity,120);
