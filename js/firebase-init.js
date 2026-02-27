import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnif9fWax7OZVCVLUWQsmSNMTTn7ucBtc",
    authDomain: "scitriad-games.firebaseapp.com",
    projectId: "scitriad-games",
    storageBucket: "scitriad-games.firebasestorage.app",
    messagingSenderId: "1057178666613",
    appId: "1:1057178666613:web:2d1f137a31082b3aa31a3c",
    measurementId: "G-SXGVGHBPC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export imports for use in auth.js
export { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    doc, 
    setDoc 
};