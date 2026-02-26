// =============================
// ATLAS GAME ENGINE MVP
// =============================

const player = document.getElementById('player');
const docs = document.querySelectorAll('.doc');
const fragmentView = document.getElementById('fragment-view');
const svg = document.getElementById('connections');

let pos = { x: 100, y: 100 };
const speed = 4;
const threshold = 120;
let activeDoc = null;

// =============================
// PLAYER MOVEMENT
// =============================

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

// =============================
// PROXIMITY SYSTEM
// =============================

function checkProximity() {
  let found = false;

  docs.forEach(doc => {
    const rect = doc.getBoundingClientRect();
    const mapRect = document.getElementById('map').getBoundingClientRect();

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

// =============================
// LOAD FRAGMENT
// =============================

async function loadFragment(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    fragmentView.innerHTML = html;
    fragmentView.style.display = 'block';
  } catch (err) {
    fragmentView.innerHTML = '<p>Fragment não encontrado</p>';
    fragmentView.style.display = 'block';
  }
}

// =============================
// CONNECTIONS (EXEMPLO)
// =============================

function drawConnections() {
  svg.innerHTML = '';

  const pairs = [
    ['doc1', 'doc2'],
    ['doc2', 'doc3']
  ];

  pairs.forEach(([a, b]) => {
    const elA = document.querySelector(`[data-id="${a}"]`);
    const elB = document.querySelector(`[data-id="${b}"]`);

    if (!elA || !elB) return;

    const rA = elA.getBoundingClientRect();
    const rB = elB.getBoundingClientRect();
    const mapRect = document.getElementById('map').getBoundingClientRect();

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

window.addEventListener('resize', drawConnections);
window.addEventListener('load', () => {
  updatePlayer();
  drawConnections();
});
