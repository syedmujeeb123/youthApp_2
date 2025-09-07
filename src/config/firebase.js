import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
  authDomain: "one-halqa.firebaseapp.com",
  projectId: "one-halqa",
  storageBucket: "one-halqa.firebasestorage.app",
  messagingSenderId: "626921915848",
  appId: "1:626921915848:web:cdbe746f0c18966f672cfd"
};

// Initialize Firebase only if no apps exist
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with proper persistence
export const auth = getAuth(app);

// Set persistence to handle multiple devices properly
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.log('Persistence setting error:', error);
  });
}

// Initialize Firestore
export const firestore = getFirestore(app);

// Export the app instance
export default app;
