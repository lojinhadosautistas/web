import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3jisbwoN9p0GJzAzfld3Y2l25ZtqIrEg",
  authDomain: "sistema-rede.firebaseapp.com",
  projectId: "sistema-rede",
  storageBucket: "sistema-rede.appspot.com",
  messagingSenderId: "930399212687",
  appId: "1:930399212687:web:a89c0d73be4b9fbd488cfa"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔒 Proteção de rota
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// 🚪 Logout
window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });

  
});
