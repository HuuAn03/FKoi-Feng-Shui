// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBX9yks4VqIFVi5NNckdkvJ5YE25TuyIRQ",
  authDomain: "swp391-fkoi.firebaseapp.com",
  projectId: "swp391-fkoi",
  storageBucket: "swp391-fkoi.firebasestorage.app",
  messagingSenderId: "77371401993",
  appId: "1:77371401993:web:fcd2b4a11c0dddcdd995d8",
  measurementId: "G-G82FCBRP0D"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const messaging = getMessaging(app);
const googleProvider = new GoogleAuthProvider();
export { storage, googleProvider };