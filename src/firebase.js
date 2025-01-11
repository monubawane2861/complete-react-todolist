// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDdHdFx68qRLBF1RLirOwr9fA1sZpFfvo",
  authDomain: "todolist-637c2.firebaseapp.com",
  projectId: "todolist-637c2",
  storageBucket: "todolist-637c2.firebasestorage.app",
  messagingSenderId: "235987598548",
  appId: "1:235987598548:web:64723185811ee90a184f41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
