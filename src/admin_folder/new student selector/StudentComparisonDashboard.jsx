// optimized code 1
import React, { useEffect, useState, useCallback } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../context/Me_Firebase";
import StudentMiniCard from "./StudentMiniCard";
import StudentSummaryModal from "./StudentSummaryModal";
import { fetchStudentSummaryByRange } from "../../utils/fetchStudentSummary";

const StudentComparisonDashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedStudentsData, setSelectedStudentsData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);

  // ✅ Fetch all students only once
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const studentList = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setAllStudents(studentList);
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    };

    fetchStudents();
  }, []);

  // ✅ Toggle student selection
  const handleSelect = useCallback((uid) => {
    setSelectedStudentIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }, []);

  // ✅ Fetch range summary for selected students
  const handleFetchData = async () => {
    if (!startDate || !endDate || selectedStudentIds.length === 0) return;

    setLoading(true);
    const newData = {};

    await Promise.all(
      selectedStudentIds.map(async (uid) => {
        const student = allStudents.find((s) => s.uid === uid);
        if (!student) return;
        try {
          const data = await fetchStudentSummaryByRange(uid, startDate, endDate);
          newData[uid] = { student, data };
        } catch (err) {
          console.error(`Error fetching summary for ${uid}`, err);
        }
      })
    );

    setSelectedStudentsData(newData);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">📋 Student Summary Comparison</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div>
          <label className="text-sm font-semibold mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={handleFetchData}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          🔍 Fetch Summary
        </button>
      </div>

      {/* Student checkboxes */}
      <div className="flex flex-wrap gap-3 mb-6">
        {allStudents.map((student) => (
          <label
            key={student.uid}
            className="border rounded px-3 py-1 cursor-pointer hover:bg-gray-100"
          >
            <input
              type="checkbox"
              checked={selectedStudentIds.includes(student.uid)}
              onChange={() => handleSelect(student.uid)}
              className="mr-2"
            />
            {student.name}
          </label>
        ))}
      </div>

      {/* Data display */}
      {loading ? (
        <p className="text-sm text-gray-500">⏳ Loading student summaries...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-start">
          {Object.entries(selectedStudentsData).map(([uid, { student, data }]) => (
            <StudentMiniCard
              key={uid}
              student={student}
              data={data}
              onViewFull={() => setModalStudent({ student, data })}
            />
          ))}
        </div>
      )}

      {/* Modal for full summary */}
      {modalStudent && (
        <StudentSummaryModal
          student={modalStudent.student}
          data={modalStudent.data}
          onClose={() => setModalStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentComparisonDashboard;




























// working code
// ________________________________________________________________________________________________________________




// import React, { useEffect, useState } from "react";
// import { getDocs, collection } from "firebase/firestore";
// import { db } from "../../context/Me_Firebase";
// import StudentMiniCard from "./StudentMiniCard";
// import StudentSummaryModal from "./StudentSummaryModal";
// import { fetchStudentSummaryByRange } from "../../utils/fetchStudentSummary";

// const StudentComparisonDashboard = () => {
//   const [allStudents, setAllStudents] = useState([]);
//   const [selectedStudentIds, setSelectedStudentIds] = useState([]);
//   const [selectedStudentsData, setSelectedStudentsData] = useState({});
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [modalStudent, setModalStudent] = useState(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const snapshot = await getDocs(collection(db, "users"));
//       const studentList = snapshot.docs.map((doc) => ({
//         uid: doc.id,
//         ...doc.data(),
//       }));
//       setAllStudents(studentList);
//     };
//     fetchStudents();
//   }, []);

//   const handleFetchData = async () => {
//     if (!startDate || !endDate || selectedStudentIds.length === 0) return;

//     setLoading(true);
//     const newData = {};

//     for (const uid of selectedStudentIds) {
//       const student = allStudents.find((s) => s.uid === uid);
//       const data = await fetchStudentSummaryByRange(uid, startDate, endDate);
//       newData[uid] = { student, data };
//     }

//     setSelectedStudentsData(newData);
//     setLoading(false);
//   };

//   const handleSelect = (uid) => {
//     setSelectedStudentIds((prev) =>
//       prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
//     );
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-2xl font-bold mb-4 text-indigo-700">📋 Student Summary Comparison</h2>

//       {/* Top controls */}
//       <div className="flex flex-wrap gap-4 items-center mb-6">
//         <div>
//           <label className="text-sm font-semibold mr-2">Start Date:</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border px-2 py-1 rounded"
//           />
//         </div>
//         <div>
//           <label className="text-sm font-semibold mr-2">End Date:</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border px-2 py-1 rounded"
//           />
//         </div>
//         <button
//           onClick={handleFetchData}
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           🔍 Fetch Summary
//         </button>
//       </div>

//       {/* Student selection checkboxes */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         {allStudents.map((student) => (
//           <label
//             key={student.uid}
//             className="border rounded px-3 py-1 cursor-pointer hover:bg-gray-100"
//           >
//             <input
//               type="checkbox"
//               checked={selectedStudentIds.includes(student.uid)}
//               onChange={() => handleSelect(student.uid)}
//               className="mr-2"
//             />
//             {student.name}
//           </label>
//         ))}
//       </div>

//       {/* Loading or data */}
//       {loading ? (
//         <p className="text-sm text-gray-500">⏳ Loading student summaries...</p>
//       ) : (
//         <div className="flex flex-wrap gap-4 justify-start">
//           {Object.entries(selectedStudentsData).map(([uid, { student, data }]) => (
//             <StudentMiniCard
//               key={uid}
//               student={student}
//               data={data}
//               onViewFull={() => setModalStudent({ student, data })}
//             />
//           ))}
//         </div>
//       )}

//       {/* ✅ Optional debug */}
//       {/* {modalStudent && <p className="text-red-600 font-medium">Opening modal for {modalStudent.student.name}</p>} */}

//       {/* Modal */}
//       {modalStudent && (
//         <StudentSummaryModal
//           student={modalStudent.student}
//           data={modalStudent.data}
//           onClose={() => setModalStudent(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default StudentComparisonDashboard;



