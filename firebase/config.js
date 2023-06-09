import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACZzB7eaMKmhis8w393xpeijBH_DN84u0",
  authDomain: "chennaicabs-admin-website-test.firebaseapp.com",
  databaseURL: "https://chennaicabs-admin-website-test-default-rtdb.firebaseio.com",
  projectId: "chennaicabs-admin-website-test",
  storageBucket: "chennaicabs-admin-website-test.appspot.com",
  messagingSenderId: "643303995045",
  appId: "1:643303995045:web:2629b09153db5fbacbff4c",
  measurementId: "G-YGGBEYD1RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage(app);
export{db};