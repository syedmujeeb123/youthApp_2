// import { useEffect, useState } from "react";
// import { useFirebase } from "../../context/Me_Firebase";
// import StudentSelector from "./StudentSelector";

// const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD

// const getPastDates = (days) => {
//   const dates = [];
//   for (let i = 0; i < days; i++) {
//     const d = new Date();
//     d.setDate(d.getDate() - i);
//     dates.push(formatDate(d));
//   }
//   return dates.reverse(); // earliest first
// };

// const StudentSummary = () => {
//   const { getDailyRecordByDate } = useFirebase();
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [records, setRecords] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });

//   const fetchData = async (uid, dates) => {
//     const fetched = {};
//     for (let date of dates) {
//       const dayDoc = await getDailyRecordByDate(date);
//       if (dayDoc && dayDoc.students && dayDoc.students[uid]) {
//         fetched[date] = dayDoc.students[uid];
//       } else {
//         fetched[date] = { submitted: false };
//       }
//     }
//     return fetched;
//   };

//   useEffect(() => {
//     const loadDefault = async () => {
//       if (!selectedStudent) return;
//       setLoading(true);
//       const dates = getPastDates(7); // default past 7 days
//       const fetched = await fetchData(selectedStudent.uid, dates);
//       setRecords(fetched);
//       setLoading(false);
//     };
//     loadDefault();
//   }, [selectedStudent]);

//   const handleRangeSearch = async () => {
//     if (!selectedStudent || !dateRange.start || !dateRange.end) return;

//     const start = new Date(dateRange.start);
//     const end = new Date(dateRange.end);
//     const rangeDates = [];

//     while (start <= end) {
//       rangeDates.push(formatDate(start));
//       start.setDate(start.getDate() + 1);
//     }

//     setLoading(true);
//     const fetched = await fetchData(selectedStudent.uid, rangeDates);
//     setRecords(fetched);
//     setLoading(false);
//   };

//   return (
//     <div className="mt-8 bg-white p-6 rounded-xl shadow">
//       <h2 className="text-xl font-bold mb-4">📋 Student Summary</h2>

//       <StudentSelector onSelect={setSelectedStudent} />

//       {selectedStudent && (
//         <>
//           <div className="mb-4">
//             <p className="text-gray-700 font-semibold">
//               Viewing records for:{" "}
//               <span className="text-blue-600">{selectedStudent.name}</span>
//             </p>
//           </div>

//           <div className="flex gap-4 items-center mb-4">
//             <input
//               type="date"
//               value={dateRange.start}
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, start: e.target.value })
//               }
//               className="border px-3 py-2 rounded-md"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={dateRange.end}
//               onChange={(e) =>
//                 setDateRange({ ...dateRange, end: e.target.value })
//               }
//               className="border px-3 py-2 rounded-md"
//             />
//             <button
//               onClick={handleRangeSearch}
//               className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
//             >
//               View Range
//             </button>
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <div className="space-y-3">
//               {Object.entries(records).map(([date, record]) => (
//                 <div
//                   key={date}
//                   className="border p-3 rounded-md bg-gray-50 flex justify-between"
//                 >
//                   <span className="font-medium">{date}</span>
//                   {record.submitted ? (
//                     <span className="text-green-600 font-semibold">✅ Submitted</span>
//                   ) : (
//                     <span className="text-red-600 font-semibold">❌ Not Submitted</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentSummary;
