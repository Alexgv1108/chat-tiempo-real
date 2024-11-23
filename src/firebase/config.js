
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
    apiKey: "AIzaSyDaWRFG9B2w1hnqlMJl6zSQmkTAs_xTX60",
    authDomain: "chat-tiempo-real-16810.firebaseapp.com",
    databaseURL: "https://chat-tiempo-real-16810-default-rtdb.firebaseio.com",
    projectId: "chat-tiempo-real-16810",
    storageBucket: "chat-tiempo-real-16810.firebasestorage.app",
    messagingSenderId: "1044808692695",
    appId: "1:1044808692695:web:e6fb1dbd105ab097a5d192",
    measurementId: "G-8QK1Z7Z315"
  };

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);