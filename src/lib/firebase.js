import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCoQEn3_ruRtZtok8VmfW2lO8d6ey8ySU0",
    authDomain: "qr-attendence-system-10ae7.firebaseapp.com",
    projectId: "qr-attendence-system-10ae7",
    storageBucket: "qr-attendence-system-10ae7.firebasestorage.app",
    messagingSenderId: "769518283356",
    appId: "1:769518283356:web:179b3dd1e9c9b48528d499",
    measurementId: "G-3FPCE14LW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
