// lucas.js — Sistema REDE

import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

/* PROTEÇÃO */
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

/* LOGOUT */
document.getElementById("logoutBtn")?.addEventListener("click", e => {
  e.preventDefault();
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

/* CHAT MOCK */
const form = document.getElementById("lucasForm");
const chat = document.getElementById("chatWindow");

form.addEventListener("submit", e => {
  e.preventDefault();

  const textarea = form.querySelector("textarea");
  const question = textarea.value.trim();
  if (!question) return;

  chat.innerHTML += `<p><strong>Você:</strong> ${question}</p>`;
  chat.innerHTML += `<p class="text-muted"><strong>LUCAS:</strong> Análise registrada. Esta funcionalidade será conectada à IA institucional.</p>`;

  textarea.value = "";
  chat.scrollTop = chat.scrollHeight;
});
