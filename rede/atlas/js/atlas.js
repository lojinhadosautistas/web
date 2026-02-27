/* ===============================
   ATLAS V3 — ESTÁVEL BASE
   =============================== */

const canvas = document.getElementById("atlas-canvas")
const ctx = canvas.getContext("2d")

const mini = document.getElementById("atlas-minimap")
const miniCtx = mini.getContext("2d")

const searchInput = document.getElementById("atlas-search")
const breadcrumbs = document.getElementById("atlas-breadcrumbs")

let DPR = window.devicePixelRatio || 1
let W, H

function resize(){
  W = canvas.clientWidth
  H = canvas.clientHeight

  canvas.width = W * DPR
  canvas.height = H * DPR
  ctx.setTransform(DPR,0,0,DPR,0,0)

  mini.width = mini.clientWidth * DPR
  mini.height = mini.clientHeight * DPR
  miniCtx.setTransform(DPR,0,0,DPR,0,0)
}
window.addEventListener("resize", resize)
resize()

/* ===============================
   VIEWPORT
=============================== */

let view = { x:0, y:0, zoom:1 }
let isDragging = false
let last = {x:0,y:0}

/* ===============================
   NODES
=============================== */

let nodes = []
let hovered = null
let selected = null

/* ===============================
   CLUSTER COLORS
=============================== */

const clusterColors = {
  sintese:"#2563eb",
  teorico:"#7c3aed",
  audio:"#ea580c",
  oficinas:"#16a34a",
  default:"#64748b"
}

/* ===============================
   READ TABLE
=============================== */

function readTable(){
  const table = document.getElementById("repoTable")
  if(!table) return

  const rows = table.querySelectorAll("tbody tr")

  let raw = []

  rows.forEach((tr,i)=>{
    const title = tr.children[0]?.innerText.trim()
    const category = tr.querySelector(".badge")?.innerText.toLowerCase() || "default"

    raw.push({
      id:i,
      title,
      category
    })
  })

  buildLayout(raw)
}

/* ===============================
   BUILD LAYOUT (RADIAL CLUSTER)
=============================== */

function buildLayout(raw){

  const clusters = {}

  raw.forEach(n=>{
    if(!clusters[n.category]) clusters[n.category]=[]
    clusters[n.category].push(n)
  })

  const clusterKeys = Object.keys(clusters)
  const radius = 420

  nodes=[]

  clusterKeys.forEach((key,ci)=>{
    const angle = (ci/clusterKeys.length)*Math.PI*2
    const cx = Math.cos(angle)*radius
    const cy = Math.sin(angle)*radius

    clusters[key].forEach((n,i)=>{
      const a = (i/clusters[key].length)*Math.PI*2
      const r = 120

      nodes.push({
        ...n,
        x: cx + Math.cos(a)*r,
        y: cy + Math.sin(a)*r,
        r:22,
        color: clusterColors[key] || clusterColors.default
      })
    })
  })
}

/* ===============================
   DRAW
=============================== */

function draw(){

  ctx.clearRect(0,0,W,H)

  ctx.save()
  ctx.translate(W/2,H/2)
  ctx.scale(view.zoom,view.zoom)
  ctx.translate(view.x,view.y)

  nodes.forEach(n=>{
    ctx.beginPath()
    ctx.arc(n.x,n.y,n.r,0,Math.PI*2)

    const scale = hovered===n ? 1.05 : 1
    ctx.save()
    ctx.translate(n.x,n.y)
    ctx.scale(scale,scale)
    ctx.translate(-n.x,-n.y)

    ctx.fillStyle=n.color
    ctx.shadowBlur= hovered===n ? 20:8
    ctx.shadowColor=n.color
    ctx.fill()

    ctx.restore()
  })

  ctx.restore()

  drawMinimap()
  requestAnimationFrame(draw)
}
draw()

/* ===============================
   MINIMAP
=============================== */

function drawMinimap(){
  const w=mini.clientWidth
  const h=mini.clientHeight

  miniCtx.clearRect(0,0,w,h)

  nodes.forEach(n=>{
    miniCtx.beginPath()
    miniCtx.arc(w/2+n.x*0.1,h/2+n.y*0.1,3,0,Math.PI*2)
    miniCtx.fillStyle=n.color
    miniCtx.fill()
  })
}

/* ===============================
   HIT DETECTION
=============================== */

function getNode(mx,my){

  const x=(mx-W/2)/view.zoom-view.x
  const y=(my-H/2)/view.zoom-view.y

  return nodes.find(n=>Math.hypot(n.x-x,n.y-y)<n.r)
}

/* ===============================
   EVENTS
=============================== */

canvas.addEventListener("mousedown",e=>{
  isDragging=true
  last={x:e.clientX,y:e.clientY}
})

window.addEventListener("mouseup",()=>isDragging=false)

canvas.addEventListener("mousemove",e=>{
  const rect=canvas.getBoundingClientRect()
  const mx=e.clientX-rect.left
  const my=e.clientY-rect.top

  hovered=getNode(mx,my)

  if(isDragging){
    view.x+=(e.clientX-last.x)/view.zoom
    view.y+=(e.clientY-last.y)/view.zoom
    last={x:e.clientX,y:e.clientY}
  }
})

canvas.addEventListener("wheel",e=>{
  const delta=e.deltaY>0?0.9:1.1
  view.zoom*=delta
})

canvas.addEventListener("click",e=>{
  const rect=canvas.getBoundingClientRect()
  const node=getNode(e.clientX-rect.left,e.clientY-rect.top)
  if(node) openFragment(node)
})

/* ===============================
   SEARCH
=============================== */

searchInput?.addEventListener("input",()=>{
  const v=searchInput.value.toLowerCase()

  const n=nodes.find(n=>n.title.toLowerCase().includes(v))
  if(n){
    view.x=-n.x
    view.y=-n.y
    view.zoom=1.6
  }
})

/* ===============================
   FRAGMENT VIEW
=============================== */

function openFragment(node){

  const fv=document.getElementById("fragment-view")
  if(!fv) return

  document.getElementById("fragment-title").innerText=node.title
  document.getElementById("fragment-content").innerHTML="Conteúdo do fragmento"

  fv.classList.add("open")

  breadcrumbs.innerText=node.title
}

document.getElementById("fragment-close")?.addEventListener("click",()=>{
  document.getElementById("fragment-view").classList.remove("open")
})

/* ===============================
   INIT
=============================== */

setTimeout(readTable,400)
