import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
  authDomain: "one-halqa.firebaseapp.com",
  projectId: "one-halqa",
  storageBucket: "one-halqa.firebasestorage.app",
  messagingSenderId: "626921915848",
  appId: "1:626921915848:web:cdbe746f0c18966f672cfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const firestore = getFirestore(app);

// Configure Firestore for different environments
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only connect to emulator in development
  try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  } catch (error) {
    // Emulator already connected or not available
    console.log('Firestore emulator not available or already connected');
  }
}

// Export the app instance
export default app;
