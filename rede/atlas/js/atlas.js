// ==============================
// ELEMENTS
// ==============================

const map = document.getElementById('map');
const player = document.getElementById('player');
const fragmentView = document.getElementById('fragment-view');
const svg = document.getElementById('connections');
const container = document.getElementById('atlas-container');

// ==============================
// STATE
// ==============================

let pos = { x: 400, y: 300 };
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

// ==============================
// INIT
// ==============================

async function initAtlas() {
  const res = await fetch('../acervo/manifest.json');
  const manifest = await res.json();

  docsData = manifest.documents || manifest;
  manifestConnections = manifest.connections || [];

  createDocsClustered(docsData);
  updatePlayer();
  updateRadar();

  requestAnimationFrame(loopConnections);
}

window.addEventListener('load', initAtlas);

// ==============================
// CLUSTER LAYOUT (FIXED)
// ==============================

function createDocsClustered(data) {

  const clusters = {};

  data.forEach(doc => {
    const key = doc.cluster || doc.type || 'default';
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(doc);
  });

  const clusterKeys = Object.keys(clusters);
  const centerX = 1000;
  const centerY = 600;
  const radius = 400;

  clusterKeys.forEach((key, cIndex) => {

    const angle = (cIndex / clusterKeys.length) * Math.PI * 2;
    const cx = centerX + Math.cos(angle) * radius;
    const cy = centerY + Math.sin(angle) * radius;

    const docs = clusters[key];

    docs.forEach((doc, i) => {

      const spread = 140;
      const angle2 = (i / docs.length) * Math.PI * 2;

      const dx = cx + Math.cos(angle2) * spread;
      const dy = cy + Math.sin(angle2) * spread;

      const el = document.createElement('div');
      el.classList.add('doc');

      if (doc.type) el.classList.add(doc.type);

      el.dataset.id = doc.id;
      el.dataset.fragment = doc.fragment
        ? `../acervo/fragments/${doc.fragment}`
        : `../acervo/fragments/frag-${doc.id}.html`;

      el.style.left = dx + 'px';
      el.style.top = dy + 'px';
      el.title = doc.title || doc.id;

      map.appendChild(el);
    });
  });
}

// ==============================
// PLAYER
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

  if (!userCameraOverride) centerOnPlayer();
}

// ==============================
// RADAR
// ==============================

const radar = document.createElement('div');
radar.id = 'radar';
map.appendChild(radar);

function updateRadar() {
  radar.style.transform = `translate(${pos.x - threshold}px, ${pos.y - threshold}px)`;
  radar.style.width = threshold * 2 + 'px';
  radar.style.height = threshold * 2 + 'px';
}

// ==============================
// PROXIMITY (SCALE FIX)
// ==============================

function checkProximity() {

  const docs = document.querySelectorAll('.doc');
  let found = false;

  docs.forEach(doc => {

    const dx = doc.offsetLeft - pos.x;
    const dy = doc.offsetTop - pos.y;
    const dist = Math.hypot(dx, dy);

    if (dist < threshold) {

      found = true;
      doc.classList.add('near');

      if (activeDoc !== doc) {
        activeDoc = doc;
        loadFragment(doc.dataset.fragment);
      }

    } else {
      doc.classList.remove('near');
    }
  });

  if (!found && activeDoc) {
    fragmentView.style.display = 'none';
    fragmentView.innerHTML = '';
    activeDoc = null;
  }

  updateRadar();
}

// ==============================
// LOAD FRAGMENT (ANTI-RELOAD)
// ==============================

async function loadFragment(url) {

  if (fragmentView.dataset.loaded === url) return;

  try {
    const res = await fetch(url);
    const html = await res.text();

    fragmentView.innerHTML = html;
    fragmentView.style.display = 'block';
    fragmentView.dataset.loaded = url;

  } catch {
    fragmentView.innerHTML = '<p>Fragment não encontrado</p>';
    fragmentView.style.display = 'block';
  }
}

// ==============================
// CONNECTIONS (IMPROVED)
// ==============================

function loopConnections() {
  drawConnectionsLive();
  requestAnimationFrame(loopConnections);
}

function worldToScreen(x, y) {
  return {
    x: x * scale + panX + 20 * scale,
    y: y * scale + panY + 20 * scale
  };
}

function drawConnectionsLive() {

  svg.innerHTML = '';

  manifestConnections.forEach(pair => {

    const elA = document.querySelector(`[data-id="${pair[0]}"]`);
    const elB = document.querySelector(`[data-id="${pair[1]}"]`);
    if (!elA || !elB) return;

    const distA = Math.hypot(elA.offsetLeft - pos.x, elA.offsetTop - pos.y);
    const distB = Math.hypot(elB.offsetLeft - pos.x, elB.offsetTop - pos.y);

    if (distA > threshold * 2 && distB > threshold * 2) return;

    const a = worldToScreen(elA.offsetLeft, elA.offsetTop);
    const b = worldToScreen(elB.offsetLeft, elB.offsetTop);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
    line.setAttribute('stroke', '#64748b');
    line.setAttribute('stroke-width', '2');

    svg.appendChild(line);
  });
}

// ==============================
// CAMERA
// ==============================

function applyCamera() {
  map.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function centerOnPlayer() {
  const rect = container.getBoundingClientRect();

  panX = rect.width / 2 - pos.x * scale - 20 * scale;
  panY = rect.height / 2 - pos.y * scale - 20 * scale;

  applyCamera();
}

// ==============================
// TOUCH + MOUSE CAMERA
// ==============================

container.addEventListener('mousedown', e => {
  isDragging = true;
  userCameraOverride = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  applyCamera();
});

window.addEventListener('mouseup', () => isDragging = false);

container.addEventListener('touchstart', e => {

  userCameraOverride = true;

  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX - panX;
    startY = e.touches[0].clientY - panY;
  }

  if (e.touches.length === 2) {
    pinchStartDist = getPinchDistance(e);
    startScale = scale;
  }

}, { passive: false });

container.addEventListener('touchmove', e => {

  if (isDragging && e.touches.length === 1) {
    panX = e.touches[0].clientX - startX;
    panY = e.touches[0].clientY - startY;
    applyCamera();
  }

  if (e.touches.length === 2) {

    const dist = getPinchDistance(e);
    const factor = dist / pinchStartDist;

    scale = Math.max(0.5, Math.min(2.2, startScale * factor));
    applyCamera();
  }

}, { passive: false });

container.addEventListener('touchend', () => {
  isDragging = false;
  pinchStartDist = null;
});

function getPinchDistance(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.hypot(dx, dy);
}

// ==============================
// LOOP
// ==============================

setInterval(checkProximity, 120);
