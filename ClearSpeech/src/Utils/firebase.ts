// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ2muDdd1nxapaiyx9csx-h524pjVjfJ8",
  authDomain: "clearspeech-4f05b.firebaseapp.com",
  projectId: "clearspeech-4f05b",
  storageBucket: "clearspeech-4f05b.firebasestorage.app",
  messagingSenderId: "273054369260",
  appId: "1:273054369260:web:f43add072ea3e308a5ecc9",
  measurementId: "G-GPTSZEB27X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase initialized:", app.name, app.options);

const analytics = getAnalytics(app);
export const db = getFirestore(app);