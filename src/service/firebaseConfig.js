// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services you need
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAf8YJby5xHJ2vDaAFq8BjDFdycQqMVvyM",
  authDomain: "ai-travel-planner-b743a.firebaseapp.com",
  projectId: "ai-travel-planner-b743a",
  storageBucket: "ai-travel-planner-b743a.firebasestorage.app",
  messagingSenderId: "1036442737805",
  appId: "1:1036442737805:web:f4da33bec198cc021156c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

