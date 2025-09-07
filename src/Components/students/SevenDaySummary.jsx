import { useEffect, useState } from "react";
import { useFirebase } from "../../context/Me_Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../context/Me_Firebase";
import { formFields } from "../../constants/formFields";
import { exportWithStatusToExcel } from "../../utils/exportUtils";

const formatDateKey = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

const SevenDaySummary = () => {
  const { user } = useFirebase();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSevenDays = async () => {
      if (!user) return;
      setLoading(true);

      const tempData = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);

        const dateKey = formatDateKey(day);
        const displayDate = formatDisplayDate(day);

        const docSnap = await getDoc(doc(db, "dailyRecords", dateKey));
        const studentRecord = docSnap.exists()
          ? docSnap.data()?.students?.[user.uid]
          : null;

        if (studentRecord?.submitted) {
          tempData.push({
            date: displayDate,
            submitted: true,
            formData: studentRecord.formData || {},
            submittedAt: studentRecord.submittedAt?.toDate?.().toLocaleTimeString() || "-",
          });
        } else {
          tempData.push({ date: displayDate, submitted: false });
        }
      }

      setData(tempData.reverse()); // Chronological order (old → new)
      setLoading(false);
    };

    fetchSevenDays();
  }, [user]);

  const handleExport = () => {
    const submitted = data
      .filter((entry) => entry.submitted)
      .map((entry) => ({
        uid: user.uid,
        name: user.displayName || user.email || "Student",
        submittedAt: entry.submittedAt,
        formData: entry.formData,
        date: entry.date,
      }));

    const pending = data
      .filter((entry) => !entry.submitted)
      .map(() => ({
        uid: user.uid,
        name: user.displayName || user.email || "Student",
      }));

    exportWithStatusToExcel(submitted, pending, formFields, "7-Day Student Summary");
  };

  if (loading) return <p className="text-center text-sm">⏳ Loading past 7 days summary...</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">📈 My Last 7 Days Submissions</h2>

      <table className="min-w-[900px] w-full text-sm border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Date</th>
            {formFields.map((field) => (
              <th key={field} className="border px-3 py-2">{field.replace(/_/g, " ")}</th>
            ))}
            <th className="border px-3 py-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="border px-3 py-2 font-medium">{entry.date}</td>
              {formFields.map((field) => (
                <td key={field} className="border px-3 py-2 text-center">
                  {entry.submitted ? entry.formData?.[field]?.value || "-" : "❌"}
                </td>
              ))}
              <td className="border px-3 py-2 text-center">
                {entry.submitted ? entry.submittedAt : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleExport}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          📥 Export to Excel
        </button>
      </div>
    </div>
  );
};

export default SevenDaySummary;













































// import { useEffect, useState } from "react";
// import { useFirebase } from "../../context/Me_Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../context/Me_Firebase";
// import { formFields } from "../../constants/formFields";

// const formatDateKey = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
// const formatDisplayDate = (date) =>
//   date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

// const SevenDaySummary = () => {
//   const { user } = useFirebase();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSevenDays = async () => {
//       if (!user) return;
//       setLoading(true);

//       const tempData = [];
//       const today = new Date();

//       for (let i = 0; i < 7; i++) {
//         const day = new Date(today);
//         day.setDate(today.getDate() - i);

//         const dateKey = formatDateKey(day);
//         const displayDate = formatDisplayDate(day);

//         const docSnap = await getDoc(doc(db, "dailyRecords", dateKey));
//         const studentRecord = docSnap.exists()
//           ? docSnap.data()?.students?.[user.uid]
//           : null;

//         if (studentRecord?.submitted) {
//           tempData.push({
//             date: displayDate,
//             submitted: true,
//             formData: studentRecord.formData || {},
//             submittedAt: studentRecord.submittedAt?.toDate?.().toLocaleTimeString() || "-",
//           });
//         } else {
//           tempData.push({ date: displayDate, submitted: false });
//         }
//       }

//       setData(tempData.reverse()); // Chronological order (old → new)
//       setLoading(false);
//     };

//     fetchSevenDays();
//   }, [user]);

//   if (loading) return <p className="text-center text-sm">⏳ Loading past 7 days summary...</p>;

//   return (
//     <div className="bg-white shadow rounded-lg p-6 mt-8 overflow-x-auto">
//       <h2 className="text-xl font-semibold mb-4 text-indigo-700">📈 My Last 7 Days Submissions</h2>

//       <table className="min-w-[900px] w-full text-sm border border-collapse">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-3 py-2">Date</th>
//             {formFields.map((field) => (
//               <th key={field} className="border px-3 py-2">{field.replace(/_/g, " ")}</th>
//             ))}
//             <th className="border px-3 py-2">Submitted At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((entry, idx) => (
//             <tr key={idx} className="border-b hover:bg-gray-50">
//               <td className="border px-3 py-2 font-medium">{entry.date}</td>
//               {formFields.map((field) => (
//                 <td key={field} className="border px-3 py-2 text-center">
//                   {entry.submitted ? entry.formData?.[field]?.value || "-" : "❌"}
//                 </td>
//               ))}
//               <td className="border px-3 py-2 text-center">
//                 {entry.submitted ? entry.submittedAt : "-"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SevenDaySummary;
