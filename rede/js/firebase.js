import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3jisbwoN9p0GJzAzfld3Y2l25ZtqIrEg",
  authDomain: "sistema-rede.firebaseapp.com",
  projectId: "sistema-rede",
  storageBucket: "sistema-rede.firebasestorage.app",
  messagingSenderId: "930399212687",
  appId: "1:930399212687:web:a89c0d73be4b9fbd488cfa"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
