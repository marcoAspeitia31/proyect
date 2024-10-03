import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database"; // Importa la Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyARsgZH-lJgpJ9FITMqjAQY6L0oVy90pSI",
  authDomain: "appmovil-fef11.firebaseapp.com",
  databaseURL: "https://appmovil-fef11-default-rtdb.firebaseio.com",
  projectId: "appmovil-fef11",
  storageBucket: "appmovil-fef11.appspot.com",
  messagingSenderId: "478162271316",
  appId: "1:478162271316:web:51a1eea7d14d1ee05f81c1",
  measurementId: "G-7DX7NPT5D4"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
export { app, analytics, db, ref, set };