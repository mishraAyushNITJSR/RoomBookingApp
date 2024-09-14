// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ceeb0.firebaseapp.com",
  projectId: "mern-estate-ceeb0",
  storageBucket: "mern-estate-ceeb0.appspot.com",
  messagingSenderId: "840514419890",
  appId: "1:840514419890:web:118b9ef4e5b98c24e9ddab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);