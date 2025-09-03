// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "topfreemail-i02c2",
  "appId": "1:570411716706:web:9c1be4a364a9e0d69d013b",
  "storageBucket": "topfreemail-i02c2.firebasestorage.app",
  "apiKey": "AIzaSyCyBTr4WCoBh7t8CemrQciOzDKv_67LLs0",
  "authDomain": "topfreemail-i02c2.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "570411716706"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
