import { useEffect, useState } from "react";
import { useFirebase } from "../../src/context/Me_Firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const PendingUsersAdmin = () => {
  const {
    db,
    getUserByUidFromAuth,
  } = useFirebase();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Load pending and rejected users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [pendingSnap, rejectedSnap] = await Promise.all([
          getDocs(collection(db, "pendingUsers")),
          getDocs(collection(db, "rejectedUsers")),
        ]);

        const pending = pendingSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
        const rejected = rejectedSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

        setPendingUsers(pending);
        setRejectedUsers(rejected);
      } catch (error) {
        console.error("🔥 Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // ✅ Approve user
  const approveUser = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.name,
        email: user.email,
        uid: user.uid,
        approvedAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "pendingUsers", user.uid));
      setPendingUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    } catch (error) {
      console.error("❌ Error approving user:", error);
    }
  };

  // ❌ Reject user
  const rejectUser = async (user) => {
    try {
      await setDoc(doc(db, "rejectedUsers", user.uid), {
        uid: user.uid,
        name: user.name,
        email: user.email,
        rejectedAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "pendingUsers", user.uid));
      setPendingUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      setRejectedUsers((prev) => [...prev, user]);
    } catch (error) {
      console.error("❌ Error rejecting user:", error);
    }
  };

  // ❌ Permanently delete rejected user (Firestore + Firebase Auth)
  const permanentlyDeleteUser = async (uid) => {
    try {
      await deleteDoc(doc(db, "rejectedUsers", uid));
      setRejectedUsers((prev) => prev.filter((u) => u.uid !== uid));

      const userToDelete = await getUserByUidFromAuth(uid); // helper from context
      if (userToDelete) {
        await userToDelete.delete();
        console.log("✅ Deleted from Firebase Auth");
      }
    } catch (error) {
      console.error("🔥 Error deleting rejected user:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        👤 Pending User Approvals
      </h2>

      {loading ? (
        <p className="text-blue-500">🔄 Loading users...</p>
      ) : (
        <>
          {/* 🕒 Pending Users Table */}
          {pendingUsers?.length > 0 ? (
            <table className="min-w-full border text-sm mb-10">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.uid}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => approveUser(user)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectUser(user)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">✅ No pending users.</p>
          )}

          {/* 🚫 Rejected Users Table */}
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            ❌ Rejected Users
          </h2>

          {rejectedUsers?.length > 0 ? (
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rejectedUsers.map((user) => (
                  <tr key={user.uid}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => permanentlyDeleteUser(user.uid)}
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                      >
                        Delete Permanently
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">🚫 No rejected users.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PendingUsersAdmin;

































// working code
// ________________________________________________________________________________________________________________



// import { useEffect, useState } from "react";
// import * as _ from "../../src/context/Me_Firebase";
// import {
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth, deleteUser } from "firebase/auth";

// const PendingUsersAdmin = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [rejectedUsers, setRejectedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const auth = getAuth();

//   // 🔄 Load both pending and rejected users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const pendingSnap = await getDocs(collection(_.db, "pendingUsers"));
//         const rejectedSnap = await getDocs(collection(_.db, "rejectedUsers"));

//         const pending = pendingSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
//         const rejected = rejectedSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

//         setPendingUsers(pending);
//         setRejectedUsers(rejected);
//       } catch (err) {
//         console.error("🔥 Error fetching users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // ✅ Approve user
//   const approveUser = async (user) => {
//     try {
//       await setDoc(doc(_.db, "users", user.uid), {
//         name: user.name,
//         email: user.email,
//         uid: user.uid,
//         approvedAt: serverTimestamp(),
//       });

//       await deleteDoc(doc(_.db, "pendingUsers", user.uid));
//       setPendingUsers((prev) => prev.filter((u) => u.uid !== user.uid));
//     } catch (err) {
//       console.error("❌ Error approving user:", err);
//     }
//   };

//   // ❌ Reject user → move to `rejectedUsers`
//   const rejectUser = async (user) => {
//     try {
//       await setDoc(doc(_.db, "rejectedUsers", user.uid), {
//         uid: user.uid,
//         name: user.name,
//         email: user.email,
//         rejectedAt: serverTimestamp(),
//       });

//       await deleteDoc(doc(_.db, "pendingUsers", user.uid));
//       setPendingUsers((prev) => prev.filter((u) => u.uid !== user.uid));
//       setRejectedUsers((prev) => [...prev, user]);
//     } catch (err) {
//       console.error("❌ Error rejecting user:", err);
//     }
//   };

//   // ❌ Permanently delete rejected user (Firestore + Firebase Auth)
//   const permanentlyDeleteUser = async (uid) => {
//     try {
//       await deleteDoc(doc(_.db, "rejectedUsers", uid));
//       setRejectedUsers((prev) => prev.filter((u) => u.uid !== uid));

//       // Try to delete from Firebase Auth
//       const userToDelete = await _.getUserByUidFromAuth(uid); // custom helper
//       if (userToDelete) {
//         await deleteUser(userToDelete);
//         console.log("✅ Deleted from Firebase Auth");
//       }
//     } catch (err) {
//       console.error("🔥 Error permanently deleting user:", err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold text-indigo-700 mb-4">👤 Pending User Approvals</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           {/* 🕒 Pending Users */}
//           {pendingUsers.length === 0 ? (
//             <p>No pending users.</p>
//           ) : (
//             <table className="min-w-full border text-sm mb-10">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-2">Name</th>
//                   <th className="border px-4 py-2">Email</th>
//                   <th className="border px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingUsers.map((user) => (
//                   <tr key={user.uid}>
//                     <td className="border px-4 py-2">{user.name}</td>
//                     <td className="border px-4 py-2">{user.email}</td>
//                     <td className="border px-4 py-2 space-x-2">
//                       <button
//                         onClick={() => approveUser(user)}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => rejectUser(user)}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       >
//                         Reject
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {/* 🚫 Rejected Users */}
//           <h2 className="text-xl font-semibold text-red-600 mb-2">❌ Rejected Users</h2>
//           {rejectedUsers.length === 0 ? (
//             <p>No rejected users.</p>
//           ) : (
//             <table className="min-w-full border text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border px-4 py-2">Name</th>
//                   <th className="border px-4 py-2">Email</th>
//                   <th className="border px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rejectedUsers.map((user) => (
//                   <tr key={user.uid}>
//                     <td className="border px-4 py-2">{user.name}</td>
//                     <td className="border px-4 py-2">{user.email}</td>
//                     <td className="border px-4 py-2">
//                       <button
//                         onClick={() => permanentlyDeleteUser(user.uid)}
//                         className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
//                       >
//                         Delete Permanently
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PendingUsersAdmin;


