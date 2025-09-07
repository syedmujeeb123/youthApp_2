
// src/components/admin/WeeklySummary.jsx
import { useEffect, useState } from "react";
import { db } from "../context/Me_Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { exportWeeklyStatusToExcel } from "../utils/exportUtils";

const formatDate = (date) => date.toLocaleDateString("en-CA");

const getPast7Dates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
};

const WeeklySummary = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [summaryMap, setSummaryMap] = useState({}); // { uid: { date1: true/false, ... } }
  const [dates, setDates] = useState(getPast7Dates());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers = usersSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setUsers(allUsers);

        const tempMap = {};
        for (const user of allUsers) {
          tempMap[user.uid] = {};
        }

        for (const date of dates) {
          const docRef = doc(db, "dailyRecords", date);
          const docSnap = await getDoc(docRef);
          const studentsMap = docSnap.exists()
            ? docSnap.data().students || {}
            : {};

          for (const user of allUsers) {
            const submitted = studentsMap[user.uid]?.submitted || false;
            tempMap[user.uid][date] = submitted;
          }
        }

        setSummaryMap(tempMap);
      } catch (err) {
        console.error("Error fetching weekly summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    exportWeeklyStatusToExcel(users, summaryMap, dates);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📅 Weekly Summary</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] text-sm border border-collapse w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-3 py-2 text-left">Name</th>
                {dates.map((date) => (
                  <th key={date} className="border px-3 py-2 text-center">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{user.name}</td>
                  {dates.map((date) => (
                    <td
                      key={date}
                      className={`border px-3 py-2 text-center ${
                        summaryMap[user.uid][date] ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {summaryMap[user.uid][date] ? "✅" : "❌"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;






















































// import { useEffect, useState } from "react";
// import { db } from "../context/Me_Firebase";
// import {
//   collection,
//   getDocs,
//   doc,
//   getDoc
// } from "firebase/firestore";
// import { exportWithStatusToExcel } from "../utils/exportUtils";

// const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD

// const getPast7Dates = () => {
//   const dates = [];
//   const today = new Date();
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);
//     dates.push(formatDate(d));
//   }
//   return dates.reverse(); // recent at bottom
// };

// const WeeklySummary = () => {
//   const [loading, setLoading] = useState(true);
//   const [weeklyData, setWeeklyData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const dates = getPast7Dates();
//       const usersSnap = await getDocs(collection(db, "users"));
//       const users = usersSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

//       const combined = [];

//       for (const date of dates) {
//         const docRef = doc(db, "dailyRecords", date);
//         const docSnap = await getDoc(docRef);
//         const studentsMap = docSnap.exists() ? docSnap.data().students || {} : {};

//         users.forEach((user) => {
//           const record = studentsMap[user.uid];
//           combined.push({
//             date,
//             name: user.name,
//             uid: user.uid,
//             status: record?.submitted ? "Submitted" : "Not Submitted",
//             submittedAt: record?.submittedAt?.toDate()?.toLocaleString() || "-",
//           });
//         });
//       }

//       setWeeklyData(combined);
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   const handleExport = () => {
//     const fields = ["Date", "Name", "Status", "SubmittedAt"];
//     const formatted = weeklyData.map((entry) => ({
//       Date: entry.date,
//       Name: entry.name,
//       Status: entry.status,
//       SubmittedAt: entry.submittedAt,
//     }));
//     exportWithStatusToExcel(formatted, [], fields, "Weekly_Summary");
//   };

//   return (
//     <div className="p-4 overflow-auto">
//       <h2 className="text-xl font-bold mb-4">📊 Weekly Summary (Past 7 Days)</h2>
//       <button
//         onClick={handleExport}
//         className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//       >
//         ⬇️ Export to Excel
//       </button>

//       {loading ? (
//         <div className="text-center py-4">Loading...</div>
//       ) : (
//         <table className="min-w-full border text-sm text-left border-collapse">
//           <thead>
//             <tr className="bg-blue-100 text-gray-700">
//               <th className="border px-3 py-2">Date</th>
//               <th className="border px-3 py-2">Name</th>
//               <th className="border px-3 py-2">Status</th>
//               <th className="border px-3 py-2">Submitted At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {weeklyData.map((row, idx) => (
//               <tr
//                 key={idx}
//                 className={
//                   row.status === "Not Submitted"
//                     ? "bg-red-50 text-red-700"
//                     : "hover:bg-blue-50"
//                 }
//               >
//                 <td className="border px-3 py-2">{row.date}</td>
//                 <td className="border px-3 py-2">{row.name}</td>
//                 <td className="border px-3 py-2">{row.status}</td>
//                 <td className="border px-3 py-2">{row.submittedAt}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default WeeklySummary;

















































// import { useEffect, useState } from "react";
// import { db } from "../context/Me_Firebase";
// import {
//     collection,
//     getDocs,
//     doc,
//     getDoc
// } from "firebase/firestore";

// const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD

// const getPast7Dates = () => {
//     const dates = [];
//     const today = new Date();
//     for (let i = 0; i < 7; i++) {
//         const d = new Date(today);
//         d.setDate(today.getDate() - i);
//         dates.push(formatDate(d));
//     }
//     return dates;
// };

// const WeeklySummary = () => {
//     const [loading, setLoading] = useState(true);
//     const [weekSummary, setWeekSummary] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             const summary = [];

//             try {
//                 const usersSnap = await getDocs(collection(db, "users"));
//                 const users = usersSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

//                 const dates = getPast7Dates();

//                 for (const date of dates) {
//                     const docRef = doc(db, "dailyRecords", date);
//                     const docSnap = await getDoc(docRef);

//                     const studentsMap = docSnap.exists() ? docSnap.data().students || {} : {};

//                     const submitted = [];
//                     const notSubmitted = [];

//                     users.forEach((user) => {
//                         if (studentsMap[user.uid]) {
//                             submitted.push({ name: user.name, uid: user.uid });
//                         } else {
//                             notSubmitted.push({ name: user.name, uid: user.uid });
//                         }
//                     });

//                     summary.push({ date, submitted, notSubmitted });
//                 }

//                 setWeekSummary(summary);
//             } catch (error) {
//                 console.error("Error fetching weekly summary:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) return <div className="text-center py-4">Loading...</div>;

//     return (
//         <div className="p-4">
//             <h2 className="text-xl font-bold mb-4">📅 Past Week Summary</h2>
//             {weekSummary.map((day) => (
//                 <div
//                     key={day.date}
//                     className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200"
//                 >
//                     <h3 className="text-lg font-semibold text-blue-700 mb-2">
//                         {day.date}
//                     </h3>

//                     <div className="mb-2">
//                         <span className="font-medium text-green-600">✔️ Submitted ({day.submitted.length}):</span>
//                         <ul className="list-disc ml-6 text-sm text-gray-800">
//                             {day.submitted.map((s) => (
//                                 <li key={s.uid}>{s.name}</li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div>
//                         <span className="font-medium text-red-600">❌ Not Submitted ({day.notSubmitted.length}):</span>
//                         <ul className="list-disc ml-6 text-sm text-gray-800">
//                             {day.notSubmitted.map((s) => (
//                                 <li key={s.uid}>{s.name}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default WeeklySummary;