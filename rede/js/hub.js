/**
 * hub.js — Sistema REDE
 * Controle de acesso + integração com roles.js
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getUserRole,
  hasAccess
} from "./roles.js";

/* =========================
   FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyC3jisbwoN9p0GJzAzfld3Y2l25ZtqIrEg",
  authDomain: "sistema-rede.firebaseapp.com",
  projectId: "sistema-rede",
  appId: "1:930399212687:web:a89c0d73be4b9fbd488cfa"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* =========================
   PROTEÇÃO DO HUB
========================= */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // 🔒 Não autenticado
    window.location.href = "login.html";
    return;
  }

  // 🎭 Define papel do usuário
  const role = getUserRole(user);
  localStorage.setItem("role", role);

  console.log("Usuário:", user.email);
  console.log("Papel:", role);

  // 🚫 Bloqueio se não tiver acesso ao hub
  if (!hasAccess(role, "hub")) {
    alert("Seu perfil não tem permissão para acessar o Hub.");
    window.location.href = "login.html";
    return;
  }

  // 🎯 Ajuste visual do Hub por papel
  applyRoleVisibility(role);
});

/* =========================
   CONTROLE VISUAL POR PAPEL
========================= */
function applyRoleVisibility(role) {

  // ROTA AZUL
  if (!hasAccess(role, "rota-azul")) {
    hideSection("rota-azul");
  }

  // CALENDÁRIO 2026
  if (!hasAccess(role, "calendario-2026")) {
    hideSection("calendario-2026");
  }

  // RELATÓRIOS
  if (!hasAccess(role, "relatorios")) {
    hideSection("relatorios");
  }
}

function hideSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.style.display = "none";
}

/* =========================
   LOGOUT
========================= */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        localStorage.removeItem("role");
        window.location.href = "login.html";
      })
      .catch((err) => {
        console.error("Erro ao sair:", err);
      });
  });
}
