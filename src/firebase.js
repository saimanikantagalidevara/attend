import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCseNAc00m0Yda0ScLDDA3F-fFgJ7Fv7KI",
  authDomain: "attendance-system-ab977.firebaseapp.com",
  projectId: "attendance-system-ab977",
  storageBucket: "attendance-system-ab977.firebasestorage.app",
  messagingSenderId: "487762108338",
  appId: "1:487762108338 :web :66b0b13be36d6a48bcceab",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
