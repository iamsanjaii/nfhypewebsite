// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

    // apiKey: "AIzaSyDs8jUYucs2_RD0q-_nsvys6GeKqMDqprw",
    // authDomain: "nfxot-f713f.firebaseapp.com",
    // projectId: "nfxot-f713f",
    // storageBucket: "nfxot-f713f.appspot.com",
    // messagingSenderId: "66315095426",
    // appId: "1:66315095426:web:6f698a1194bd3baf3c939b",
    // measurementId: "G-Y3KBFPQTNM"
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);  // Pass the app instance
export const db = getFirestore(app);
export const storage = getStorage(app);  // Add this line if you want to use Firebase Storage

export default app;
