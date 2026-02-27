const map = document.getElementById('map');
const player = document.getElementById('player');
const fragmentView = document.getElementById('fragment-view');
const svg = document.getElementById('connections');

let pos = { x: 200, y: 200 };
const speed = 5;
const threshold = 140;

let docsData = [];
let connectionsData = [];
let activeDoc = null;

// ==============================
// RESPONSIVE HELPERS
// ==============================

function getResponsiveCols() {
  const w = window.innerWidth;

  if (w < 576) return 2;      // mobile
  if (w < 992) return 3;      // tablet
  return 5;                   // desktop
}

function getResponsiveGap() {
  const w = window.innerWidth;

  if (w < 576) return 140;
  if (w < 992) return 160;
  return 180;
}

// ==============================
// INIT
// ==============================

async function initAtlas() {
  const res = await fetch('../acervo/manifest.json');
  const manifest = await res.json();

  docsData = manifest.documents || manifest;
  connectionsData = manifest.connections || [];

  createDocs();
  layoutDocs();
  drawConnections(connectionsData);
  updatePlayer();
}

window.addEventListener('load', initAtlas);

window.addEventListener('resize', () => {
  layoutDocs();
  drawConnections(connectionsData);
});

// ==============================
// CREATE DOCS
// ==============================

function createDocs() {
  docsData.forEach(doc => {

    const el = document.createElement('div');
    el.classList.add('doc');
    el.classList.add(doc.type);

    el.dataset.fragment = `../acervo/fragments/${doc.fragment}`;
    el.dataset.id = doc.id;

    map.appendChild(el);
  });
}

// ==============================
// LAYOUT DOCS (RESPONSIVE)
// ==============================

function layoutDocs() {

  const COLS = getResponsiveCols();
  const GAP = getResponsiveGap();
  const OFFSET = 80;

  const nodes = document.querySelectorAll('.doc');

  nodes.forEach((el, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);

    el.style.left = col * GAP + OFFSET + 'px';
    el.style.top = row * GAP + OFFSET + 'px';
  });

  resizeMap(COLS, GAP, OFFSET);
}

// ==============================
// RESIZE MAP
// ==============================

function resizeMap(COLS, GAP, OFFSET) {
  const rows = Math.ceil(docsData.length / COLS);

  map.style.width = COLS * GAP + OFFSET * 2 + 'px';
  map.style.height = rows * GAP + OFFSET * 2 + 'px';
}

// ==============================
// PLAYER MOVEMENT
// ==============================

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') pos.y -= speed;
  if (e.key === 'ArrowDown') pos.y += speed;
  if (e.key === 'ArrowLeft') pos.x -= speed;
  if (e.key === 'ArrowRight') pos.x += speed;

  updatePlayer();
  checkProximity();
});

function updatePlayer() {
  player.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
}

// ==============================
// PROXIMITY
// ==============================

function checkProximity() {
  const docs = document.querySelectorAll('.doc');
  let found = false;

  docs.forEach(doc => {
    const rect = doc.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();

    const dx = (rect.left - mapRect.left) - pos.x;
    const dy = (rect.top - mapRect.top) - pos.y;
    const dist = Math.hypot(dx, dy);

    if (dist < threshold) {
      found = true;
      if (activeDoc !== doc) {
        activeDoc = doc;
        loadFragment(doc.dataset.fragment);
      }
    }
  });

  if (!found) {
    fragmentView.style.display = 'none';
    fragmentView.innerHTML = '';
    activeDoc = null;
  }
}

// ==============================
// LOAD FRAGMENT
// ==============================

async function loadFragment(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    fragmentView.innerHTML = html;
    fragmentView.style.display = 'block';
  } catch {
    fragmentView.innerHTML = '<p>Fragment não encontrado</p>';
    fragmentView.style.display = 'block';
  }
}

// ==============================
// DRAW CONNECTIONS
// ==============================

function drawConnections(connections) {
  svg.innerHTML = '';

  const mapRect = map.getBoundingClientRect();

  connections.forEach(pair => {
    const elA = document.querySelector(`[data-id="${pair[0]}"]`);
    const elB = document.querySelector(`[data-id="${pair[1]}"]`);
    if (!elA || !elB) return;

    const rA = elA.getBoundingClientRect();
    const rB = elB.getBoundingClientRect();

    const x1 = rA.left - mapRect.left + 20;
    const y1 = rA.top - mapRect.top + 20;
    const x2 = rB.left - mapRect.left + 20;
    const y2 = rB.top - mapRect.top + 20;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#94a3b8');
    line.setAttribute('stroke-width', '2');

    svg.appendChild(line);
  });
}
