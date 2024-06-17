// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Correct import for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjFYAcV5xIsHUgo4RUTbgbxa-6b0uMOAk",
  authDomain: "seeknook-dev.firebaseapp.com",
  projectId: "seeknook-dev",
  storageBucket: "seeknook-dev.appspot.com",
  messagingSenderId: "839635489702",
  appId: "1:839635489702:web:37f7111879cb10ee16f567",
  measurementId: "G-ERN493BMZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); // Correctly initialize Firestore with modular import

export default app;
