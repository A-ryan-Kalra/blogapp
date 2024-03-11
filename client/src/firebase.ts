// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3901f.firebaseapp.com",
  projectId: "mern-blog-3901f",
  storageBucket: "mern-blog-3901f.appspot.com",
  messagingSenderId: "950335694054",
  appId: "1:950335694054:web:d8ba1b4b3fc81a2ffe8727",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
