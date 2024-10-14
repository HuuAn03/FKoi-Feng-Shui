// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9ftVF_6AsLO8EWtI1dNu1bHeSs73KYzA",
  authDomain: "studentmanagement-d28fb.firebaseapp.com",
  projectId: "studentmanagement-d28fb",
  storageBucket: "studentmanagement-d28fb.appspot.com",
  messagingSenderId: "211289122584",
  appId: "1:211289122584:web:08445d52c787af8438206d",
  measurementId: "G-MZVY13CLNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { storage, googleProvider };