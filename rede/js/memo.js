/* ===============================
   MEMO — Motor de memória navegável
   =============================== */

let manifestData = null;
let input;
let results;

/* Cache de documentos (evita refetch) */
const documentCache = {};

/* ===============================
   INIT
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  input = document.getElementById("memoSearch");
  results = document.getElementById("memoResults");

  if (!input || !results) {
    console.warn("MEMO: elementos de busca não encontrados.");
    return;
  }

  input.addEventListener("input", e => {
    search(e.target.value.trim());
  });

  loadManifest();
});

/* ===============================
   MANIFEST
   =============================== */

async function loadManifest() {
  try {
    const response = await fetch("acervo/manifest.json");
    manifestData = await response.json();

    makeBidirectional();

    console.log("MEMO: manifest carregado", manifestData);
  } catch (err) {
    console.error("MEMO: erro ao carregar manifest", err);
  }
}

/* Backlinks automáticos */
function makeBidirectional() {
  manifestData.documents.forEach(doc => {
    doc.connections = doc.connections || [];

    doc.connections.forEach(connId => {
      const target = manifestData.documents.find(d => d.id === connId);

      if (target) {
        target.connections = target.connections || [];

        if (!target.connections.includes(doc.id)) {
          target.connections.push(doc.id);
        }
      }
    });
  });
}

/* ===============================
   DOCUMENT FETCH + CACHE
   =============================== */

async function fetchDocumentContent(path) {
  if (documentCache[path]) return documentCache[path];

  try {
    const response = await fetch(path);
    const text = await response.text();

    documentCache[path] = text;
    return text;
  } catch (err) {
    console.error("MEMO: erro ao carregar documento", path, err);
    return "";
  }
}

/* ===============================
   SEARCH
   =============================== */

async function search(term) {
  results.innerHTML = "";

  if (!term || !manifestData) return;

  const normalized = term.toLowerCase();

  for (const doc of manifestData.documents) {
    const content = await fetchDocumentContent(doc.path);

    const contentMatch = content.toLowerCase().includes(normalized);
    const tagMatch = (doc.tags || []).some(tag =>
      tag.toLowerCase().includes(normalized)
    );

    if (contentMatch || tagMatch) {
      const div = document.createElement("div");
      div.className = "memo-result-item";

      div.innerHTML = `
        <strong>${doc.title}</strong><br>
        <small>Tags: ${(doc.tags || []).join(", ")}</small>
      `;

      div.onclick = () => openDocument(doc);
      results.appendChild(div);
    }
  }
}

/* ===============================
   OPEN DOCUMENT
   =============================== */

async function openDocument(doc) {
  const content = await fetchDocumentContent(doc.path);

  results.innerHTML = `
    <div class="module-card">
      <h3>${doc.title}</h3>
      ${content}
      <hr>
      <div id="connections"></div>
    </div>
  `;

  renderConnections(doc);
}

/* ===============================
   CONNECTIONS
   =============================== */

function renderConnections(doc) {
  const container = document.getElementById("connections");

  if (!container || !doc.connections || !doc.connections.length) return;

  container.innerHTML = "<h5>Conexões</h5>";

  doc.connections.forEach(connId => {
    const connectedDoc = manifestData.documents.find(d => d.id === connId);

    if (connectedDoc) {
      const link = document.createElement("div");
      link.className = "memo-result-item";
      link.innerText = connectedDoc.title;

      link.onclick = () => openDocument(connectedDoc);
      container.appendChild(link);
    }
  });
}
