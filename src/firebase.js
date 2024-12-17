import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database"; 

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQaNQ9r1XYhZjx9J3ZsLQqJ8yDK2T6gPo",
  authDomain: "super-kompras.firebaseapp.com",
  databaseURL: "https://super-kompras.firebaseio.com",
  projectId: "super-kompras",
  storageBucket: "super-kompras.appspot.com",
  messagingSenderId: "401245304429",
  appId: "1:401245304429:web:4ac8ba27934b393b53f164",
  measurementId: "G-NKJJ595SXR"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Analytics solo si está disponible
let analytics;
if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  analytics = getAnalytics(app);
}

const db = getDatabase(app);

export { app, analytics, db, ref, set, get, onValue, update };
