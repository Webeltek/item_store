// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjkHcN--8a84vsRAGqGeHy4305-Aa62AQ",
  authDomain: "tv-store-2025.firebaseapp.com",
  projectId: "tv-store-2025",
  storageBucket: "tv-store-2025.firebasestorage.app",
  messagingSenderId: "346940718639",
  appId: "1:346940718639:web:baef8db67664e24f9b90da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default { auth, provider };