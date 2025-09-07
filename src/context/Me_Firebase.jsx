// optimization code according to pending users approval and rejection
// optimized code 3
// Me_Firebase.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../config/firebase";

// Export db for compatibility
export const db = firestore;

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [cachedAllUsers, setCachedAllUsers] = useState(null);
  const [cachedRejectedUsers, setCachedRejectedUsers] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  // 🔄 Loading State Management
  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const isloggedin = !!user;

  // 🧠 Memoized Refs
  const usersRef = collection(firestore, "users");
  const rejectedRef = collection(firestore, "rejectedUsers");
  const pendingRef = collection(firestore, "pendingUsers");
  const dailyRecordsRef = collection(firestore, "dailyRecords");

  // 🧾 Auth Observer with simplified error handling
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (u) {
          setLoading('userInfo', true);
          const snap = await getDoc(doc(usersRef, u.uid));
          setUserInfo(snap.exists() ? snap.data() : null);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUserInfo(null);
      } finally {
        setUserInfoLoading(false);
        setLoading('userInfo', false);
      }
    });
    return unsub;
  }, [usersRef, setLoading]);

  // 🔐 Register User → Pending
  const registeringwithuserandpass = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(pendingRef, user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
    });

    return result;
  };

  // 🔑 Login / Logout
  const signinguserwithemailandpass = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // 🟡 Check Approval Status
  const checkApprovalStatus = async (uid) => {
    if (!uid) return { status: "unauthenticated" };

    const [approvedSnap, rejectedSnap, pendingSnap] = await Promise.all([
      getDoc(doc(usersRef, uid)),
      getDoc(doc(rejectedRef, uid)),
      getDoc(doc(pendingRef, uid)),
    ]);

    if (approvedSnap.exists()) return { status: "approved", data: approvedSnap.data() };
    if (rejectedSnap.exists()) return { status: "rejected", data: rejectedSnap.data() };
    if (pendingSnap.exists()) return { status: "pending", data: pendingSnap.data() };

    return { status: "not_found" };
  };

  // ✅ Approve User
  const approvePendingUser = async (uid, userData) => {
    await setDoc(doc(usersRef, uid), {
      ...userData,
      approvedAt: serverTimestamp(),
    });

    // Optional: update flag in pendingUsers if you want to keep it
    await updateDoc(doc(pendingRef, uid), { approved: true });

    setCachedAllUsers(null); // force refetch
  };

  // ❌ Reject User
  const rejectPendingUser = async (uid, userData) => {
    await setDoc(doc(rejectedRef, uid), {
      ...userData,
      rejectedAt: serverTimestamp(),
    });

    // Optional: update flag in pendingUsers if you want to keep it
    await updateDoc(doc(pendingRef, uid), { rejected: true });

    setCachedRejectedUsers(null);
  };

  // ❌ Delete Rejected User Permanently
  const deleteRejectedUser = async (uid) => {
    await deleteDoc(doc(rejectedRef, uid));
    const currentUser = auth.currentUser;
    if (currentUser?.uid === uid) {
      await deleteUser(currentUser);
    }
    setCachedRejectedUsers(null);
  };

  // 📥 Get Rejected Users
  const getAllRejectedUsers = async () => {
    if (cachedRejectedUsers) return cachedRejectedUsers;

    const snap = await getDocs(rejectedRef);
    const list = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    setCachedRejectedUsers(list);
    return list;
  };

  // 📥 Get All Approved Users
  const getAllUsers = async () => {
    if (cachedAllUsers) return cachedAllUsers;

    const snap = await getDocs(usersRef);
    const list = snap.docs.map((doc) => doc.data());
    setCachedAllUsers(list);
    return list;
  };

  // 👤 Get Single User
  const getUserInfo = async (uid) => {
    if (cachedAllUsers) {
      return cachedAllUsers.find((u) => u.uid === uid) || null;
    }
    const snap = await getDoc(doc(usersRef, uid));
    return snap.exists() ? snap.data() : null;
  };

  const getUsernameByUID = async (uid) => {
    const user = await getUserInfo(uid);
    return user?.name || "Anonymous";
  };

  // 📝 Form Submission (once per day) with simplified error handling
  const submitDailyForm = async (uid, name, formData) => {
    try {
      const today = formatDate();
      const ref = doc(dailyRecordsRef, today);
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

  // 📅 Get Form Data by Date
  const getDailyRecordByDate = async (date) => {
    const snap = await getDoc(doc(dailyRecordsRef, date));
    return snap.exists() ? snap.data() : null;
  };

  const getUserForms = async (uid) => {
    const today = formatDate();
    const record = await getDailyRecordByDate(today);
    const students = record?.students || {};
    return Object.entries(students)
      .filter(([id]) => id === uid)
      .map(([id, form]) => ({ id, ...form }));
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isloggedin,
        userInfo,
        userInfoLoading,
        logout,
        registeringwithuserandpass,
        signinguserwithemailandpass,

        checkApprovalStatus,
        approvePendingUser,
        rejectPendingUser,
        getAllRejectedUsers,
        deleteRejectedUser,

        getAllUsers,
        getUserInfo,
        getUsernameByUID,

        submitDailyForm,
        getDailyRecordByDate,
        getUserForms,

        firestore,
        db,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};



































// optimization code 2
// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   deleteUser,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   collection,
//   serverTimestamp,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";

// // 🔧 Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
//   authDomain: "one-halqa.firebaseapp.com",
//   projectId: "one-halqa",
//   storageBucket: "one-halqa.firebasestorage.app",
//   messagingSenderId: "626921915848",
//   appId: "1:626921915848:web:cdbe746f0c18966f672cfd",
// };

// // 🔌 Firebase init
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const firestore = getFirestore(app);
// export const db = firestore;

// const FirebaseContext = createContext(null);
// export const useFirebase = () => useContext(FirebaseContext);

// const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// export const FirebaseProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const [userInfoLoading, setUserInfoLoading] = useState(true);
//   const [cachedAllUsers, setCachedAllUsers] = useState(null);
//   const [cachedRejectedUsers, setCachedRejectedUsers] = useState(null);

//   const isloggedin = !!user;

//   // 👤 Auth State
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (u) => {
//       setUser(u || null);
//       if (u) {
//         const docSnap = await getDoc(doc(firestore, "users", u.uid));
//         setUserInfo(docSnap.exists() ? docSnap.data() : null);
//       } else {
//         setUserInfo(null);
//       }
//       setUserInfoLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   // 📝 Register user → pendingUsers
//   const registeringwithuserandpass = async (name, email, password) => {
//     const result = await createUserWithEmailAndPassword(auth, email, password);
//     const user = result.user;

//     await setDoc(doc(firestore, "pendingUsers", user.uid), {
//       uid: user.uid,
//       name,
//       email,
//       createdAt: serverTimestamp(),
//     });

//     return result;
//   };

//   const signinguserwithemailandpass = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   const logout = () => signOut(auth);

//   // ✅ Check approval or rejection status
//   const checkApprovalStatus = async (uid) => {
//     if (!uid) return { status: "unauthenticated" };

//     const approvedSnap = await getDoc(doc(firestore, "users", uid));
//     if (approvedSnap.exists()) return { status: "approved", data: approvedSnap.data() };

//     const rejectedSnap = await getDoc(doc(firestore, "rejectedUsers", uid));
//     if (rejectedSnap.exists()) return { status: "rejected", data: rejectedSnap.data() };

//     const pendingSnap = await getDoc(doc(firestore, "pendingUsers", uid));
//     if (pendingSnap.exists()) return { status: "pending", data: pendingSnap.data() };

//     return { status: "not_found" };
//   };

//   const approvePendingUser = async (userId, userData) => {
//     await setDoc(doc(firestore, "users", userId), {
//       ...userData,
//       approvedAt: serverTimestamp(),
//     });
//     await updateDoc(doc(firestore, "pendingUsers", userId), {
//       approved: true,
//     });
//     setCachedAllUsers(null);
//   };

//   const rejectPendingUser = async (userId, userData) => {
//     await setDoc(doc(firestore, "rejectedUsers", userId), {
//       ...userData,
//       rejectedAt: serverTimestamp(),
//     });
//     await updateDoc(doc(firestore, "pendingUsers", userId), {
//       rejected: true,
//     });
//     setCachedRejectedUsers(null);
//   };

//   const deleteRejectedUser = async (uid) => {
//     await deleteDoc(doc(firestore, "rejectedUsers", uid));
//     const currentUser = auth.currentUser;
//     if (currentUser?.uid === uid) {
//       await deleteUser(currentUser);
//     }
//     setCachedRejectedUsers(null);
//   };

//   const getAllRejectedUsers = async () => {
//     if (cachedRejectedUsers) return cachedRejectedUsers;

//     const snap = await getDocs(collection(firestore, "rejectedUsers"));
//     const data = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
//     setCachedRejectedUsers(data);
//     return data;
//   };

//   const getUserInfo = async (uid) => {
//     if (cachedAllUsers) {
//       const found = cachedAllUsers.find((u) => u.uid === uid);
//       return found || null;
//     }

//     const snap = await getDoc(doc(firestore, "users", uid));
//     return snap.exists() ? snap.data() : null;
//   };

//   const getUsernameByUID = async (uid) => {
//     const user = await getUserInfo(uid);
//     return user?.name || "Anonymous";
//   };

//   const getAllUsers = async () => {
//     if (cachedAllUsers) return cachedAllUsers;

//     const snap = await getDocs(collection(firestore, "users"));
//     const users = snap.docs.map((doc) => doc.data());
//     setCachedAllUsers(users);
//     return users;
//   };

//   const submitDailyForm = async (uid, name, formData) => {
//     const today = formatDate();
//     const ref = doc(firestore, "dailyRecords", today);
//     const snap = await getDoc(ref);
//     const data = snap.exists() ? snap.data() : {};

//     if (data.students?.[uid]) {
//       return { success: false, message: "Already submitted today." };
//     }

//     const updated = {
//       ...(data.students || {}),
//       [uid]: {
//         name,
//         submitted: true,
//         submittedAt: serverTimestamp(),
//         formData,
//       },
//     };

//     await setDoc(ref, { students: updated }, { merge: true });
//     return { success: true };
//   };

//   const getDailyRecordByDate = async (date) => {
//     const snap = await getDoc(doc(firestore, "dailyRecords", date));
//     return snap.exists() ? snap.data() : null;
//   };

//   const getUserForms = async (uid) => {
//     const today = formatDate();
//     const record = await getDailyRecordByDate(today);
//     const students = record?.students || {};
//     return Object.entries(students)
//       .filter(([id]) => id === uid)
//       .map(([id, form]) => ({ id, ...form }));
//   };

//   return (
//     <FirebaseContext.Provider
//       value={{
//         user,
//         isloggedin,
//         userInfo,
//         userInfoLoading,
//         logout,
//         registeringwithuserandpass,
//         signinguserwithemailandpass,

//         getUserInfo,
//         getUsernameByUID,
//         getAllUsers,
//         getUserForms,

//         submitDailyForm,
//         getDailyRecordByDate,

//         approvePendingUser,
//         rejectPendingUser,
//         getAllRejectedUsers,
//         deleteRejectedUser,

//         checkApprovalStatus,

//         firestore,
//         db,
//       }}
//     >
//       {children}
//     </FirebaseContext.Provider>
//   );
// };





























// // optimization code 1
// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   deleteUser,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   collection,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// // 🔧 Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
//   authDomain: "one-halqa.firebaseapp.com",
//   projectId: "one-halqa",
//   storageBucket: "one-halqa.firebasestorage.app",
//   messagingSenderId: "626921915848",
//   appId: "1:626921915848:web:cdbe746f0c18966f672cfd"
// };

// // 🔌 Firebase init
// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAuth = getAuth(firebaseApp);
// const firestore = getFirestore(firebaseApp);
// export const db = firestore;

// const FirebaseContext = createContext(null);
// export const useFirebase = () => useContext(FirebaseContext);
// const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// export const FirebaseProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const [userInfoLoading, setUserInfoLoading] = useState(true);
//   const [cachedAllUsers, setCachedAllUsers] = useState(null);
//   const [cachedRejectedUsers, setCachedRejectedUsers] = useState(null);

//   const isloggedin = !!user;

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(firebaseAuth, async (u) => {
//       setUser(u || null);

//       if (u) {
//         const docSnap = await getDoc(doc(firestore, "users", u.uid));
//         if (docSnap.exists()) {
//           setUserInfo(docSnap.data());
//         } else {
//           setUserInfo(null);
//         }
//       } else {
//         setUserInfo(null);
//       }

//       setUserInfoLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // 📝 Register → Add to pendingUsers
//   const registeringwithuserandpass = async (name, email, password) => {
//     const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
//     const user = result.user;

//     await setDoc(doc(firestore, "pendingUsers", user.uid), {
//       uid: user.uid,
//       name,
//       email,
//       createdAt: serverTimestamp(),
//     });

//     return result;
//   };

//   const signinguserwithemailandpass = (email, password) =>
//     signInWithEmailAndPassword(firebaseAuth, email, password);

//   const logout = () => signOut(firebaseAuth);

//   const approvePendingUser = async (userId, userData) => {
//     await setDoc(doc(firestore, "users", userId), {
//       ...userData,
//       approvedAt: serverTimestamp(),
//     });

//     await updateDoc(doc(firestore, "pendingUsers", userId), {
//       approved: true,
//     });

//     setCachedAllUsers(null); // Refresh cache
//   };

//   const getUserInfo = async (uid) => {
//     if (cachedAllUsers) {
//       const found = cachedAllUsers.find((u) => u.uid === uid);
//       return found || null;
//     }

//     const snap = await getDoc(doc(firestore, "users", uid));
//     return snap.exists() ? snap.data() : null;
//   };

//   const getUsernameByUID = async (uid) => {
//     const user = await getUserInfo(uid);
//     return user?.name || "Anonymous";
//   };

//   const submitDailyForm = async (uid, name, formData) => {
//     const today = formatDate();
//     const ref = doc(firestore, "dailyRecords", today);
//     const snap = await getDoc(ref);
//     const data = snap.exists() ? snap.data() : {};

//     if (data.students?.[uid]) {
//       return { success: false, message: "Already submitted today." };
//     }

//     const updated = {
//       ...(data.students || {}),
//       [uid]: {
//         name,
//         submitted: true,
//         submittedAt: serverTimestamp(),
//         formData,
//       },
//     };

//     await setDoc(ref, { students: updated }, { merge: true });
//     return { success: true };
//   };

//   const getDailyRecordByDate = async (date) => {
//     const snap = await getDoc(doc(firestore, "dailyRecords", date));
//     return snap.exists() ? snap.data() : null;
//   };

//   const getAllUsers = async () => {
//     if (cachedAllUsers) return cachedAllUsers;

//     const snap = await getDocs(collection(firestore, "users"));
//     const users = snap.docs.map((doc) => doc.data());
//     setCachedAllUsers(users);
//     return users;
//   };

//   const getUserForms = async (uid) => {
//     const today = formatDate();
//     const record = await getDailyRecordByDate(today);
//     const students = record?.students || {};
//     return Object.entries(students)
//       .filter(([id]) => id === uid)
//       .map(([id, form]) => ({ id, ...form }));
//   };

//   const rejectPendingUser = async (userId, userData) => {
//     await setDoc(doc(firestore, "rejectedUsers", userId), {
//       ...userData,
//       rejectedAt: serverTimestamp(),
//     });

//     await updateDoc(doc(firestore, "pendingUsers", userId), {
//       rejected: true,
//     });

//     setCachedRejectedUsers(null); // Refresh
//   };

//   const getAllRejectedUsers = async () => {
//     if (cachedRejectedUsers) return cachedRejectedUsers;

//     const snap = await getDocs(collection(firestore, "rejectedUsers"));
//     const data = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
//     setCachedRejectedUsers(data);
//     return data;
//   };

//   const deleteRejectedUser = async (uid) => {
//     await setDoc(doc(firestore, "rejectedUsers", uid), {}, { merge: false });
//     if (firebaseAuth.currentUser?.uid === uid) {
//       await deleteUser(firebaseAuth.currentUser);
//     }
//     setCachedRejectedUsers(null);
//   };

//   return (
//     <FirebaseContext.Provider
//       value={{
//         user,
//         isloggedin,
//         userInfo,
//         userInfoLoading,
//         logout,
//         registeringwithuserandpass,
//         signinguserwithemailandpass,

//         getUserInfo,
//         getUsernameByUID,
//         getAllUsers,
//         getUserForms,

//         submitDailyForm,
//         getDailyRecordByDate,

//         approvePendingUser,
//         rejectPendingUser,
//         getAllRejectedUsers,
//         deleteRejectedUser,

//         firestore,
//         db,
//       }}
//     >
//       {children}
//     </FirebaseContext.Provider>
//   );
// };











































// working code
//  _________________________________________________________________________________________________





// import { createContext, useContext, useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   deleteUser,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   collection,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// // 🔧 Firebase config
// const firebaseConfig = {
//  apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
//   authDomain: "one-halqa.firebaseapp.com",
//   projectId: "one-halqa",
//   storageBucket: "one-halqa.firebasestorage.app",
//   messagingSenderId: "626921915848",
//   appId: "1:626921915848:web:cdbe746f0c18966f672cfd"
// };

// // 🔌 Firebase init
// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAuth = getAuth(firebaseApp);
// const firestore = getFirestore(firebaseApp);
// export const db = firestore;

// // 📦 Context
// const FirebaseContext = createContext(null);
// export const useFirebase = () => useContext(FirebaseContext);

// // 📅 Format date to YYYY-MM-DD
// const formatDate = (date = new Date()) =>
//   date.toLocaleDateString("en-CA");

// export const FirebaseProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const [userInfoLoading, setUserInfoLoading] = useState(true);

//   const isloggedin = !!user;

//   // 🔁 Watch auth state
// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(firebaseAuth, async (u) => {
//     setUser(u || null);

//     if (u) {
//       const docRef = doc(firestore, "users", u.uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setUserInfo(data);
//         console.log("✅ User Info Loaded:", data);
//       } else {
//         setUserInfo(null);
//         console.warn("⚠️ No userInfo found for this UID in 'users'");
//       }
//     } else {
//       setUserInfo(null);
//       console.log("ℹ️ No user logged in");
//     }

//     setUserInfoLoading(false); // ✅ Auth state is resolved now
//   });

//   return unsubscribe;
// }, []);

//   // 📝 Register → Add to pendingUsers
//   const registeringwithuserandpass = async (name, email, password) => {
//     const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
//     const user = result.user;

//     await setDoc(doc(firestore, "pendingUsers", user.uid), {
//       uid: user.uid,
//       name,
//       email,
//       createdAt: serverTimestamp(),
//     });

//     return result;
//   };

//   // 🔓 Login
//   const signinguserwithemailandpass = (email, password) =>
//     signInWithEmailAndPassword(firebaseAuth, email, password);

//   // 🚪 Logout
//   const logout = () => signOut(firebaseAuth);

//   // ✅ Admin Approval: Move from pendingUsers → users
//   const approvePendingUser = async (userId, userData) => {
//     await setDoc(doc(firestore, "users", userId), {
//       ...userData,
//       approvedAt: serverTimestamp(),
//     });

//     await updateDoc(doc(firestore, "pendingUsers", userId), {
//       approved: true,
//     });
//   };

//   // 📦 Utility Functions
//   const getUserInfo = async (uid) => {
//     const snap = await getDoc(doc(firestore, "users", uid));
//     return snap.exists() ? snap.data() : null;
//   };

//   const getUsernameByUID = async (uid) => {
//     const user = await getUserInfo(uid);
//     return user?.name || "Anonymous";
//   };

//   // 🧾 Submit Form (once/day)
//   const submitDailyForm = async (uid, name, formData) => {
//     const today = formatDate();
//     const ref = doc(firestore, "dailyRecords", today);
//     const snap = await getDoc(ref);
//     const data = snap.exists() ? snap.data() : {};

//     if (data.students?.[uid]) {
//       return { success: false, message: "Already submitted today." };
//     }

//     const updated = {
//       ...(data.students || {}),
//       [uid]: {
//         name,
//         submitted: true,
//         submittedAt: serverTimestamp(),
//         formData,
//       },
//     };

//     await setDoc(ref, { students: updated }, { merge: true });
//     return { success: true };
//   };

//   // 📅 Get record for date
//   const getDailyRecordByDate = async (date) => {
//     const snap = await getDoc(doc(firestore, "dailyRecords", date));
//     return snap.exists() ? snap.data() : null;
//   };

//   // 👥 Get all approved users
//   const getAllUsers = async () => {
//     const snap = await getDocs(collection(firestore, "users"));
//     return snap.docs.map((doc) => doc.data());
//   };

//   // 📃 Get current user's form entries
//   const getUserForms = async (uid) => {
//     const today = formatDate();
//     const record = await getDailyRecordByDate(today);
//     const students = record?.students || {};
//     return Object.entries(students)
//       .filter(([id]) => id === uid)
//       .map(([id, form]) => ({ id, ...form }));
//   };



// const rejectPendingUser = async (userId, userData) => {
//   await setDoc(doc(firestore, "rejectedUsers", userId), {
//     ...userData,
//     rejectedAt: serverTimestamp(),
//   });

//   // Optional: mark as rejected in pendingUsers
//   await updateDoc(doc(firestore, "pendingUsers", userId), {
//     rejected: true,
//   });
// };

// // 🔄 Get all rejected users
// const getAllRejectedUsers = async () => {
//   const snap = await getDocs(collection(firestore, "rejectedUsers"));
//   return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
// };

// // 🧹 Delete rejected user completely
// const deleteRejectedUser = async (uid) => {
//   await setDoc(doc(firestore, "rejectedUsers", uid), {}, { merge: false }); // delete doc
//   await firebaseAuth.currentUser?.uid === uid && deleteUser(firebaseAuth.currentUser);
// };








//   return (
//     <FirebaseContext.Provider
//       value={{
//         // Auth
//         user,
//         isloggedin,
//         userInfo,
//         logout,
//         registeringwithuserandpass,
//         signinguserwithemailandpass,

//         // User data
//         getUserInfo,
//         getUsernameByUID,
//         getAllUsers,
//         getUserForms,
//         userInfoLoading,

//         // Forms
//         submitDailyForm,
//         getDailyRecordByDate,

//         // Admin
//         approvePendingUser,

//         rejectPendingUser,
// getAllRejectedUsers,
// deleteRejectedUser,


//         // Firestore
//         firestore,
//         db,
//       }}
//     >
//       {children}
//     </FirebaseContext.Provider>
//   );
// };







