// Simplified Firebase context to prevent infinite loops
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, firestore } from "../config/firebase";

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

export const SimpleFirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  const isloggedin = !!user;

  // Simple auth observer without complex dependencies
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(firestore, "users", u.uid));
          setUserInfo(snap.exists() ? snap.data() : null);
        } catch (error) {
          console.error('Error getting user info:', error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
      setUserInfoLoading(false);
    });
    return unsub;
  }, []); // Empty dependency array to prevent loops

  // Simple functions without useCallback to avoid dependency issues
  const registeringwithuserandpass = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(firestore, "pendingUsers", user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
    });

    return result;
  };

  const signinguserwithemailandpass = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const getUsernameByUID = async (uid) => {
    try {
      const snap = await getDoc(doc(firestore, "users", uid));
      const userData = snap.exists() ? snap.data() : null;
      return userData?.name || "Anonymous";
    } catch (error) {
      console.error('Error getting username:', error);
      return "Anonymous";
    }
  };

  const submitDailyForm = async (uid, name, formData) => {
    try {
      const today = formatDate();
      const ref = doc(firestore, "dailyRecords", today);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};

      if (data.students?.[uid]) {
        return { success: false, message: "Already submitted today." };
      }

      const updated = {
        ...(data.students || {}),
        [uid]: {
          name,
          submitted: true,
          submittedAt: serverTimestamp(),
          formData,
        },
      };

      await setDoc(ref, { students: updated }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Form submission error:', error);
      return { success: false, message: `Error submitting form: ${error.message}` };
    }
  };

  const value = {
    // Auth
    user,
    isloggedin,
    userInfo,
    userInfoLoading,
    logout,
    registeringwithuserandpass,
    signinguserwithemailandpass,

    // Forms
    submitDailyForm,
    getUsernameByUID,

    // Firestore
    firestore,
    db: firestore,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

