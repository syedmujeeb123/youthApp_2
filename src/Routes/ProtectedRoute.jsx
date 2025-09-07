// 🔒 Approved users → allowed access

// 🕒 Pending users → shown message + logout button

// ❌ Rejected users → shown rejection message + logout button

// ⛔ Unauthenticated users → redirected to /login

// ✅ Firebase Firestore checks for users, pendingUsers, and rejectedUsers

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "../context/Me_Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../context/Me_Firebase";

const ProtectedRoute = ({ children }) => {
  const { user, isloggedin, userInfoLoading, logout } = useFirebase();
  const [approvalStatus, setApprovalStatus] = useState("checking"); // "checking", "approved", "pending", "rejected", "unauthenticated"

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) {
        setApprovalStatus("unauthenticated");
        return;
      }

      try {
        const uid = user.uid;

        const approvedRef = doc(db, "users", uid);
        const rejectedRef = doc(db, "rejectedUsers", uid);
        const pendingRef = doc(db, "pendingUsers", uid);

        const [approvedSnap, rejectedSnap, pendingSnap] = await Promise.all([
          getDoc(approvedRef),
          getDoc(rejectedRef),
          getDoc(pendingRef),
        ]);

        if (approvedSnap.exists()) {
          setApprovalStatus("approved");
        } else if (rejectedSnap.exists()) {
          setApprovalStatus("rejected");
        } else if (pendingSnap.exists()) {
          setApprovalStatus("pending");
        } else {
          setApprovalStatus("unauthenticated");
        }
      } catch (error) {
        console.error("🔥 Error checking approval status:", error);
        setApprovalStatus("unauthenticated");
      }
    };

    checkApprovalStatus();
  }, [user]);

  // 🔄 While Firebase is loading
  if (userInfoLoading || approvalStatus === "checking") {
    return (
      <div className="text-center mt-10 text-blue-500">
        🔄 Checking your access...
      </div>
    );
  }

  // ❌ Not logged in
  if (!isloggedin || !user || approvalStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // ❌ Pending user
  if (approvalStatus === "pending") {
    return (
      <div className="text-center mt-10 text-orange-600 space-y-4">
        <p>🕒 Your account is pending admin approval.</p>
        <button
          onClick={logout}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    );
  }

  // ❌ Rejected user
  if (approvalStatus === "rejected") {
    return (
      <div className="text-center mt-10 text-red-600 space-y-4">
        <p>❌ Your account was rejected. Please contact the main admin.</p>
        <button
          onClick={logout}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    );
  }

  // ✅ Approved user (normal user or admin)
  return children;
};

export default ProtectedRoute;































// optimized code 1

// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useFirebase } from "../context/Me_Firebase";

// const ProtectedRoute = ({ children }) => {
//   const { user, isloggedin, logout, checkApprovalStatus } = useFirebase();
//   const [status, setStatus] = useState("checking"); // checking, approved, pending, rejected, unauthenticated

//   useEffect(() => {
//     const checkStatus = async () => {
//       if (!user) {
//         setStatus("unauthenticated");
//         return;
//       }

//       const result = await checkApprovalStatus(user.uid); // central function from context
//       setStatus(result);
//     };

//     checkStatus();
//   }, [user, checkApprovalStatus]);

//   if (!isloggedin || status === "unauthenticated") {
//     return <Navigate to="/login" replace />;
//   }

//   if (status === "checking") {
//     return (
//       <div className="text-center mt-10 text-blue-600">
//         🔄 Checking approval status...
//       </div>
//     );
//   }

//   if (status === "rejected") {
//     return (
//       <div className="text-center mt-10 text-red-600 space-y-4">
//         <p>❌ Your account was not approved or has been rejected. Please contact the admin.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   if (status === "pending") {
//     return (
//       <div className="text-center mt-10 text-orange-600 space-y-4">
//         <p>🕒 Your account is pending admin approval. Please wait or contact the admin.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   if (status === "approved") {
//     return children;
//   }

//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
























































//  working code
//  _________________________________________________________________________________________________



// import { Navigate } from "react-router-dom";
// import { useFirebase } from "../context/Me_Firebase";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../context/Me_Firebase";

// const ProtectedRoute = ({ children }) => {
//   const { user, isloggedin, logout } = useFirebase();
//   const [status, setStatus] = useState("checking"); // "checking", "approved", "pending", "rejected", "unauthenticated"

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       if (!user) {
//         setStatus("unauthenticated");
//         return;
//       }

//       try {
//         const uid = user.uid;

//         const userDoc = await getDoc(doc(db, "users", uid));
//         if (userDoc.exists()) {
//           setStatus("approved");
//           return;
//         }

//         const rejectedDoc = await getDoc(doc(db, "rejectedUsers", uid));
//         if (rejectedDoc.exists()) {
//           setStatus("rejected");
//           return;
//         }

//         const pendingDoc = await getDoc(doc(db, "pendingUsers", uid));
//         if (pendingDoc.exists()) {
//           setStatus("pending");
//           return;
//         }

//         // If not found anywhere, consider unauthenticated
//         setStatus("unauthenticated");
//       } catch (error) {
//         console.error("Error checking user status:", error);
//         setStatus("unauthenticated");
//       }
//     };

//     checkUserStatus();
//   }, [user]);

//   if (!isloggedin || status === "unauthenticated") {
//     return <Navigate to="/login" replace />;
//   }

//   if (status === "checking") {
//     return (
//       <div className="text-center mt-10 text-blue-600">
//         🔄 Checking approval status...
//       </div>
//     );
//   }

//   if (status === "rejected") {
//     return (
//       <div className="text-center mt-10 text-red-600 space-y-4">
//         <p>❌ Your account was not approved or has been rejected. Please contact the admin.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   if (status === "pending") {
//     return (
//       <div className="text-center mt-10 text-orange-600 space-y-4">
//         <p>🕒 Your account is pending admin approval. Please wait or contact the admin.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   // ✅ Approved users only
//   if (status === "approved") {
//     return children;
//   }

//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;






