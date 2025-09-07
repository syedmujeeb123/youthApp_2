import { useEffect, useState } from "react";
import { db } from "../../context/Me_Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../../context/Me_Firebase";
import { formFields } from "../../constants/formFields";

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

const DailySummary = () => {
  const { user } = useFirebase();
  const [todayData, setTodayData] = useState(null);
  const [yesterdayData, setYesterdayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayKey = formatDate(today);
        const yestKey = formatDate(yesterday);

        const [todaySnap, yestSnap] = await Promise.all([
          getDoc(doc(db, "dailyRecords", todayKey)),
          getDoc(doc(db, "dailyRecords", yestKey)),
        ]);

        const todayRecord = todaySnap.exists() ? todaySnap.data().students?.[uid] : null;
        const yestRecord = yestSnap.exists() ? yestSnap.data().students?.[uid] : null;

        setTodayData(todayRecord?.submitted ? todayRecord : null);
        setYesterdayData(yestRecord?.submitted ? yestRecord : null);
      } catch (err) {
        console.error("❌ Error loading daily summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [user]);

  if (loading) return <p>⏳ Loading your daily submissions...</p>;

  const renderRow = (label, data, fallbackText) => {
    if (data) {
      return (
        <tr>
          <td className="border px-3 py-2 font-semibold">{label}</td>
          {formFields.map((field) => (
            <td key={field} className="border px-3 py-2 text-center">
              {data.formData?.[field]?.value || "-"}
            </td>
          ))}
          <td className="border px-3 py-2">
            {data.submittedAt?.toDate?.().toLocaleTimeString() || "-"}
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="bg-yellow-50 text-gray-700">
          <td className="border px-3 py-2 font-semibold">{label}</td>
          <td colSpan={formFields.length + 1} className="border px-3 py-2 text-center italic">
            {fallbackText}
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 overflow-auto">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">
        📅 Today & Yesterday Summary
      </h2>
      <table className="min-w-full text-sm border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Day</th>
            {formFields.map((field) => (
              <th key={field} className="border px-3 py-2">
                {field.replace(/_/g, " ")}
              </th>
            ))}
            <th className="border px-3 py-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {renderRow("Today", todayData, "⚠️ You haven't submitted the form for today.")}
          {renderRow("Yesterday", yesterdayData, "⚠️ You did not submit the form yesterday.")}
        </tbody>
      </table>
    </div>
  );
};

export default DailySummary;











































// import { useEffect, useState } from "react";
// import { db } from "../../context/Me_Firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useFirebase } from "../../context/Me_Firebase";
// import { formFields } from "../../constants/formFields";

// const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// const DailySummary = () => {
//   const { user } = useFirebase();
//   const [todayData, setTodayData] = useState(null);
//   const [yesterdayData, setYesterdayData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       try {
//         const uid = user?.uid;
//         if (!uid) return;

//         const today = new Date();
//         const yesterday = new Date();
//         yesterday.setDate(today.getDate() - 1);

//         const todayKey = formatDate(today);
//         const yestKey = formatDate(yesterday);

//         const [todaySnap, yestSnap] = await Promise.all([
//           getDoc(doc(db, "dailyRecords", todayKey)),
//           getDoc(doc(db, "dailyRecords", yestKey)),
//         ]);

//         const todayRecord = todaySnap.exists() ? todaySnap.data().students?.[uid] : null;
//         const yestRecord = yestSnap.exists() ? yestSnap.data().students?.[uid] : null;

//         setTodayData(todayRecord?.submitted ? todayRecord : null);
//         setYesterdayData(yestRecord?.submitted ? yestRecord : null);
//       } catch (err) {
//         console.error("❌ Error loading daily summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmission();
//   }, [user]);

//   if (loading) return <p>⏳ Loading your daily submissions...</p>;

//   const renderRow = (label, data) => (
//     <tr>
//       <td className="border px-3 py-2 font-semibold">{label}</td>
//       {formFields.map((field) => (
//         <td key={field} className="border px-3 py-2 text-center">
//           {data?.formData?.[field]?.value || "-"}
//         </td>
//       ))}
//       <td className="border px-3 py-2">
//         {data?.submittedAt?.toDate?.().toLocaleTimeString() || "-"}
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mt-6 overflow-auto">
//       <h2 className="text-xl font-semibold text-indigo-700 mb-4">
//         📅 Today & Yesterday Summary
//       </h2>
//       <table className="min-w-full text-sm border border-collapse">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-3 py-2">Day</th>
//             {formFields.map((field) => (
//               <th key={field} className="border px-3 py-2">
//                 {field.replace(/_/g, " ")}
//               </th>
//             ))}
//             <th className="border px-3 py-2">Submitted At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {todayData && renderRow("Today", todayData)}
//           {yesterdayData && renderRow("Yesterday", yesterdayData)}
//           {!todayData && !yesterdayData && (
//             <tr>
//               <td colSpan={formFields.length + 2} className="text-center py-4 text-gray-500">
//                 ❌ No submissions for today or yesterday.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DailySummary;
