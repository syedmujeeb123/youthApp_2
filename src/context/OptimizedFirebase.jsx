import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAThHyZI29NeU9OJ128CtyJvPPUWu3acIY",
  authDomain: "one-halqa.firebaseapp.com",
  projectId: "one-halqa",
  storageBucket: "one-halqa.firebasestorage.app",
  messagingSenderId: "626921915848",
  appId: "1:626921915848:web:cdbe746f0c18966f672cfd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export const db = firestore;

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// 🧠 Cache Management
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value) {
    this.cache.set(key, value);
    this.cacheTimestamps.set(key, Date.now());
  }

  get(key) {
    const timestamp = this.cacheTimestamps.get(key);
    if (timestamp && Date.now() - timestamp < this.CACHE_DURATION) {
      return this.cache.get(key);
    }
    this.cache.delete(key);
    this.cacheTimestamps.delete(key);
    return null;
  }

  clear() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }
}

const cacheManager = new CacheManager();

export const OptimizedFirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});

  const isloggedin = !!user;

  // 🧠 Memoized Refs
  const usersRef = useMemo(() => collection(firestore, "users"), []);
  const rejectedRef = useMemo(() => collection(firestore, "rejectedUsers"), []);
  const pendingRef = useMemo(() => collection(firestore, "pendingUsers"), []);
  const dailyRecordsRef = useMemo(() => collection(firestore, "dailyRecords"), []);

  // 🔄 Loading State Management
  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  // 🧾 Auth Observer with Error Handling
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

  // 🔐 Register User → Pending (with loading state)
  const registeringwithuserandpass = useCallback(async (name, email, password) => {
    setLoading('register', true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await setDoc(doc(pendingRef, user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });

      cacheManager.invalidate('pendingUsers');
      return result;
    } finally {
      setLoading('register', false);
    }
  }, [pendingRef, setLoading]);

  // 🔑 Login / Logout
  const signinguserwithemailandpass = useCallback(async (email, password) => {
    setLoading('login', true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading('login', false);
    }
  }, [setLoading]);

  const logout = useCallback(async () => {
    setLoading('logout', true);
    try {
      await signOut(auth);
      cacheManager.clear(); // Clear cache on logout
    } finally {
      setLoading('logout', false);
    }
  }, [setLoading]);

  // 🟡 Check Approval Status (with caching)
  const checkApprovalStatus = useCallback(async (uid) => {
    if (!uid) return { status: "unauthenticated" };

    const cacheKey = `approval_${uid}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const [approvedSnap, rejectedSnap, pendingSnap] = await Promise.all([
        getDoc(doc(usersRef, uid)),
        getDoc(doc(rejectedRef, uid)),
        getDoc(doc(pendingRef, uid)),
      ]);

      let result;
      if (approvedSnap.exists()) {
        result = { status: "approved", data: approvedSnap.data() };
      } else if (rejectedSnap.exists()) {
        result = { status: "rejected", data: rejectedSnap.data() };
      } else if (pendingSnap.exists()) {
        result = { status: "pending", data: pendingSnap.data() };
      } else {
        result = { status: "not_found" };
      }

      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error checking approval status:', error);
      return { status: "error", error: error.message };
    }
  }, [usersRef, rejectedRef, pendingRef]);

  // ✅ Approve User (with cache invalidation)
  const approvePendingUser = useCallback(async (uid, userData) => {
    setLoading('approve', true);
    try {
      await setDoc(doc(usersRef, uid), {
        ...userData,
        approvedAt: serverTimestamp(),
      });

      await updateDoc(doc(pendingRef, uid), { approved: true });
      
      cacheManager.invalidate('users');
      cacheManager.invalidate('pendingUsers');
      cacheManager.invalidate(`approval_${uid}`);
    } finally {
      setLoading('approve', false);
    }
  }, [usersRef, pendingRef, setLoading]);

  // ❌ Reject User (with cache invalidation)
  const rejectPendingUser = useCallback(async (uid, userData) => {
    setLoading('reject', true);
    try {
      await setDoc(doc(rejectedRef, uid), {
        ...userData,
        rejectedAt: serverTimestamp(),
      });

      await updateDoc(doc(pendingRef, uid), { rejected: true });
      
      cacheManager.invalidate('rejectedUsers');
      cacheManager.invalidate('pendingUsers');
      cacheManager.invalidate(`approval_${uid}`);
    } finally {
      setLoading('reject', false);
    }
  }, [rejectedRef, pendingRef, setLoading]);

  // 📥 Get All Users (with caching)
  const getAllUsers = useCallback(async () => {
    const cacheKey = 'all_users';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    setLoading('getAllUsers', true);
    try {
      const snap = await getDocs(usersRef);
      const list = snap.docs.map((doc) => doc.data());
      cacheManager.set(cacheKey, list);
      return list;
    } finally {
      setLoading('getAllUsers', false);
    }
  }, [usersRef, setLoading]);

  // 👤 Get Single User (with caching)
  const getUserInfo = useCallback(async (uid) => {
    if (!uid) return null;
    
    const cacheKey = `user_${uid}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const snap = await getDoc(doc(usersRef, uid));
      const result = snap.exists() ? snap.data() : null;
      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }, [usersRef]);

  const getUsernameByUID = useCallback(async (uid) => {
    const user = await getUserInfo(uid);
    return user?.name || "Anonymous";
  }, [getUserInfo]);

  // 📝 Form Submission (with loading state)
  const submitDailyForm = useCallback(async (uid, name, formData) => {
    setLoading('submitForm', true);
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
      
      // Invalidate daily records cache
      cacheManager.invalidate('dailyRecords');
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading('submitForm', false);
    }
  }, [dailyRecordsRef, setLoading]);

  // 📅 Get Form Data by Date (with caching)
  const getDailyRecordByDate = useCallback(async (date) => {
    const cacheKey = `dailyRecord_${date}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const snap = await getDoc(doc(dailyRecordsRef, date));
      const result = snap.exists() ? snap.data() : null;
      cacheManager.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting daily record:', error);
      return null;
    }
  }, [dailyRecordsRef]);

  const getUserForms = useCallback(async (uid) => {
    const today = formatDate();
    const record = await getDailyRecordByDate(today);
    const students = record?.students || {};
    return Object.entries(students)
      .filter(([id]) => id === uid)
      .map(([id, form]) => ({ id, ...form }));
  }, [getDailyRecordByDate]);

  // 📥 Get Rejected Users (with caching)
  const getAllRejectedUsers = useCallback(async () => {
    const cacheKey = 'rejected_users';
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    setLoading('getRejectedUsers', true);
    try {
      const snap = await getDocs(rejectedRef);
      const list = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      cacheManager.set(cacheKey, list);
      return list;
    } finally {
      setLoading('getRejectedUsers', false);
    }
  }, [rejectedRef, setLoading]);

  // ❌ Delete Rejected User Permanently
  const deleteRejectedUser = useCallback(async (uid) => {
    setLoading('deleteUser', true);
    try {
      await deleteDoc(doc(rejectedRef, uid));
      const currentUser = auth.currentUser;
      if (currentUser?.uid === uid) {
        await deleteUser(currentUser);
      }
      cacheManager.invalidate('rejectedUsers');
    } finally {
      setLoading('deleteUser', false);
    }
  }, [rejectedRef, setLoading]);

  const value = useMemo(() => ({
    // Auth
    user,
    isloggedin,
    userInfo,
    userInfoLoading,
    logout,
    registeringwithuserandpass,
    signinguserwithemailandpass,

    // User Management
    checkApprovalStatus,
    approvePendingUser,
    rejectPendingUser,
    getAllRejectedUsers,
    deleteRejectedUser,
    getAllUsers,
    getUserInfo,
    getUsernameByUID,

    // Forms
    submitDailyForm,
    getDailyRecordByDate,
    getUserForms,

    // Loading States
    isLoading,
    loadingStates,

    // Firestore
    firestore,
    db,
  }), [
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
    isLoading,
    loadingStates,
    firestore,
  ]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
