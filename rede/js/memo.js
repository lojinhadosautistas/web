let manifestData = null;

const input = document.getElementById("memoSearch");
const results = document.getElementById("memoResults");

async function loadManifest() {
  const response = await fetch("acervo/manifest.json");
  manifestData = await response.json();
}

async function fetchDocumentContent(path) {
  const response = await fetch(path);
  return await response.text();
}

function highlight(text, term) {
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

async function search(term) {
  results.innerHTML = "";
  if (!term || !manifestData) return;

  for (const doc of manifestData.documents) {

    const content = await fetchDocumentContent(doc.path);

    if (
      content.toLowerCase().includes(term.toLowerCase()) ||
      doc.tags.some(tag => tag.includes(term.toLowerCase()))
    ) {
      const div = document.createElement("div");
      div.className = "memo-result-item";

      div.innerHTML = `
        <strong>${doc.title}</strong><br>
        <small>Tags: ${doc.tags.join(", ")}</small>
      `;

      div.onclick = () => openDocument(doc);
      results.appendChild(div);
    }
  }
}

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

function renderConnections(doc) {
  const container = document.getElementById("connections");
  if (!doc.connections.length) return;

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

input.addEventListener("input", e => {
  search(e.target.value.trim());
});

loadManifest();
