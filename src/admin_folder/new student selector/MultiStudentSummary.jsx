import React, { useState } from "react";
import StudentMultiSelect from "./StudentMultiSelect";
import StudentMiniSummary from "./StudentMiniSummary";
import StudentComparisonDashboard from "./StudentComparisonDashboard";

const MultiStudentSummary = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [focusedStudent, setFocusedStudent] = useState(null);

  const handleSelect = (uids) => {
    setSelectedStudents(uids);
    setFocusedStudent(null); // Reset any fullscreen when selection changes
  };

  const handleFocus = (uid) => {
    setFocusedStudent(uid);
  };

  const handleCloseFullscreen = () => {
    setFocusedStudent(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">👥 Multi Student Comparison</h2>
      <StudentMultiSelect onSelect={handleSelect} />

      {focusedStudent ? (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-auto p-6">
          <StudentComparisonDashboard uid={focusedStudent} />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCloseFullscreen}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            >
              ❌ Close
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {selectedStudents.map((uid) => (
            <StudentMiniSummary key={uid} uid={uid} onExpand={() => handleFocus(uid)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiStudentSummary;




























// import { useEffect, useState } from "react";
// import { db } from "../../context/Me_Firebase";
// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { formFields } from "../../constants/formFields";
// import { exportSingleUserToExcel } from "../../utils/exportUtils";

// import StudentCardFullscreen from "./StudentCardFullscreen";

// const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// const MultiStudentSummary = () => {
//   const [students, setStudents] = useState([]);
//   const [selectedUIDs, setSelectedUIDs] = useState([]);
//   const [studentData, setStudentData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [expandedUID, setExpandedUID] = useState(null);


//   const [fullscreenStudent, setFullscreenStudent] = useState(null);





//   useEffect(() => {
//     const fetchStudents = async () => {
//       const snapshot = await getDocs(collection(db, "users"));
//       const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
//       setStudents(users);
//     };
//     fetchStudents();
//   }, []);

//   const handleSelect = async (uid) => {
//     if (selectedUIDs.includes(uid)) {
//       setSelectedUIDs((prev) => prev.filter((id) => id !== uid));
//     } else {
//       setSelectedUIDs((prev) => [...prev, uid]);
//       if (!studentData[uid]) {
//         const today = formatDate(new Date());
//         const yesterday = formatDate(new Date(Date.now() - 86400000));

//         const [todaySnap, yestSnap] = await Promise.all([
//           getDoc(doc(db, "dailyRecords", today)),
//           getDoc(doc(db, "dailyRecords", yesterday)),
//         ]);

//         const todayData = todaySnap.exists() ? todaySnap.data().students?.[uid] : null;
//         const yestData = yestSnap.exists() ? yestSnap.data().students?.[uid] : null;

//         setStudentData((prev) => ({
//           ...prev,
//           [uid]: {
//             today: todayData?.submitted ? todayData : null,
//             yesterday: yestData?.submitted ? yestData : null,
//             name: students.find((s) => s.uid === uid)?.name || "Unknown",
//           },
//         }));
//       }
//     }
//   };

//   const renderCard = (uid) => {
//     const entry = studentData[uid];
//     if (!entry) return null;

//     const renderRow = (label, data) => (
//       <tr>
//         <td className="border px-2 py-1 font-medium">{label}</td>
//         {formFields.map((field) => (
//           <td key={field} className="border px-2 py-1 text-center">
//             {data?.formData?.[field]?.value || "-"}
//           </td>
//         ))}
//         <td className="border px-2 py-1 text-center">
//           {data?.submittedAt?.toDate?.().toLocaleTimeString() || "-"}
//         </td>
//       </tr>
//     );

//     return (
//       <div
//         key={uid}
//         className={`bg-white shadow rounded-lg p-4 m-2 transition-all duration-300 ${
//           expandedUID === uid ? "w-full z-20 fixed top-0 left-0 h-screen overflow-y-auto bg-white" : "w-[350px]"
//         }`}
//         style={{ maxHeight: expandedUID === uid ? "100%" : "500px" }}
//       >
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-lg font-semibold text-indigo-600">
//             {entry.name} 📋
//           </h2>
//           <div>
//             {expandedUID === uid ? (
//               <button
//                 onClick={() => setExpandedUID(null)}
//                 className="text-red-600 hover:underline"
//               >
//                 Close
//               </button>
//             ) : (
//               <button
//                 onClick={() => setExpandedUID(uid)}
//                 className="text-blue-600 hover:underline"
//               >
//                 Expand
//               </button>
//             )}
//           </div>
//         </div>

//         <table className="text-xs border w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-2 py-1">Day</th>
//               {formFields.map((field) => (
//                 <th key={field} className="border px-2 py-1">{field.replace(/_/g, " ")}</th>
//               ))}
//               <th className="border px-2 py-1">Submitted At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entry.today && renderRow("Today", entry.today)}
//             {entry.yesterday && renderRow("Yesterday", entry.yesterday)}
//             {!entry.today && !entry.yesterday && (
//               <tr>
//                 <td colSpan={formFields.length + 2} className="text-center text-gray-500 py-4">
//                   ❌ No submissions yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {expandedUID === uid && (
//           <div className="mt-4 text-right">
//             <button
//               onClick={() => exportSingleUserToExcel(entry, entry.name)}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               📥 Export to Excel
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">👥 Select Students to Compare</h2>

//       <div className="flex flex-wrap gap-3 mb-6">
//         {students.map((student) => (
//           <label key={student.uid} className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={selectedUIDs.includes(student.uid)}
//               onChange={() => handleSelect(student.uid)}
//             />
//             {student.name}
//           </label>
//         ))}
//       </div>

//       <div className="flex flex-wrap gap-4 justify-start">
//         {selectedUIDs.map((uid) => renderCard(uid))}
//       </div>
//     </div>
//   );
// };

// export default MultiStudentSummary;
