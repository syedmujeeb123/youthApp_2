// optimized code 3
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "../context/Me_Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../context/Me_Firebase";

const AdminProtectedRoute = ({ children }) => {
  const { user, userInfo, isloggedin, userInfoLoading, logout } = useFirebase();
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
        console.error("🔥 Error checking admin approval status:", error);
        setApprovalStatus("unauthenticated");
      }
    };

    checkApprovalStatus();
  }, [user]);

  // 🔄 While loading
  if (userInfoLoading || approvalStatus === "checking") {
    return (
      <div className="text-center mt-10 text-blue-500">
        🔄 Checking admin access...
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

  // ❌ Not an admin
  if (!userInfo?.isAdmin) {
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Access denied: You are not an admin.
      </div>
    );
  }

  // ✅ Approved and admin
  return children;
};

export default AdminProtectedRoute;





































// // optimized code 2
// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { useFirebase } from "../context/Me_Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../context/Me_Firebase";

// const AdminProtectedRoute = ({ children }) => {
//   const { user, userInfo, isloggedin, userInfoLoading, logout } = useFirebase();
//   const [approvalStatus, setApprovalStatus] = useState("checking"); // "checking", "approved", "pending", "rejected"

//   useEffect(() => {
//     const checkApprovalStatus = async () => {
//       if (!user) {
//         setApprovalStatus("unauthenticated");
//         return;
//       }

//       try {
//         const uid = user.uid;

//         const approvedDoc = await getDoc(doc(db, "users", uid));
//         if (approvedDoc.exists()) {
//           setApprovalStatus("approved");
//           return;
//         }

//         const rejectedDoc = await getDoc(doc(db, "rejectedUsers", uid));
//         if (rejectedDoc.exists()) {
//           setApprovalStatus("rejected");
//           return;
//         }

//         const pendingDoc = await getDoc(doc(db, "pendingUsers", uid));
//         if (pendingDoc.exists()) {
//           setApprovalStatus("pending");
//           return;
//         }

//         setApprovalStatus("unauthenticated");
//       } catch (error) {
//         console.error("Error checking approval status:", error);
//         setApprovalStatus("unauthenticated");
//       }
//     };

//     checkApprovalStatus();
//   }, [user]);

//   // 🔄 Still loading Firebase auth info
//   if (userInfoLoading || approvalStatus === "checking") {
//     return (
//       <div className="text-center mt-10 text-blue-500">
//         🔄 Checking admin access...
//       </div>
//     );
//   }

//   // ❌ Not logged in or not found
//   if (!isloggedin || !user || approvalStatus === "unauthenticated") {
//     return <Navigate to="/login" replace />;
//   }

//   // ❌ Account is pending
//   if (approvalStatus === "pending") {
//     return (
//       <div className="text-center mt-10 text-orange-600 space-y-4">
//         <p>🕒 Your account is pending admin approval.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   // ❌ Rejected user
//   if (approvalStatus === "rejected") {
//     return (
//       <div className="text-center mt-10 text-red-600 space-y-4">
//         <p>❌ Your account was rejected. Please contact the main admin.</p>
//         <button
//           onClick={logout}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     );
//   }

//   // ❌ Not an admin
//   if (!userInfo?.isAdmin) {
//     return (
//       <div className="text-center text-red-600 mt-10">
//         ❌ Access denied: You are not an admin.
//       </div>
//     );
//   }

//   // ✅ Approved admin
//   return children;
// };

// export default AdminProtectedRoute;

































// optimized code 1
// import { Navigate } from "react-router-dom";
// import { useFirebase } from "../context/Me_Firebase";

// const AdminProtectedRoute = ({ children }) => {
//   const { user, userInfo, isloggedin, userInfoLoading } = useFirebase();

//   if (userInfoLoading) {
//     return (
//       <div className="text-center mt-10 text-blue-500">
//         🔄 Checking admin access...
//       </div>
//     );
//   }

//   if (!isloggedin || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!userInfo?.isAdmin) {
//     return (
//       <div className="text-center text-red-600 mt-10">
//         ❌ Access denied: You are not an admin.
//       </div>
//     );
//   }

//   return children;
// };

// export default AdminProtectedRoute;



















// working code 
// ____________________________________________________________________________________________________________________

// import { Navigate } from "react-router-dom";
// import { useFirebase } from "../context/Me_Firebase";

// const AdminProtectedRoute = ({ children }) => {
//   const { user, userInfo, isloggedin, userInfoLoading } = useFirebase();

//   // 🕒 Wait until Firebase finishes checking auth + user info
//   if (userInfoLoading) {
//     return <div className="text-center mt-10 text-blue-500">🔄 Checking admin access...</div>;
//   }

//   // 🚫 Not logged in → Redirect to login
//   if (!isloggedin) {
//     return <Navigate to="/login" replace />;
//   }

//   // 🚫 Logged in but not admin
//   if (!userInfo?.isAdmin) {
//     return (
//       <div className="text-center text-red-600 mt-10">
//         ❌ Access denied: You are not an admin.
//       </div>
//     );
//   }

//   // ✅ Approved admin → Allow access
//   return children;
// };

// export default AdminProtectedRoute;
