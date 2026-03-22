// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY-zqMhazobVUKZyAR1RQpbFo3msZPF6Y",
  authDomain: "animetracker4lk.firebaseapp.com",
  projectId: "animetracker4lk",
  storageBucket: "animetracker4lk.firebasestorage.app",
  messagingSenderId: "229461634934",
  appId: "1:229461634934:web:c5b532de2f9f785c71d457",
  measurementId: "G-G6F340H5VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, analytics };