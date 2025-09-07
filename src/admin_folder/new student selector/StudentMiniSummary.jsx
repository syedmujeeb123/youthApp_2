import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../context/Me_Firebase";
import { formFields } from "../../constants/formFields";

const formatDate = (date) => date.toLocaleDateString("en-CA");

const StudentMiniSummary = ({ uid, onExpand }) => {
  const [name, setName] = useState("Loading...");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) setName(userSnap.data().name);

        const today = new Date();
        const temp = [];

        for (let i = 0; i < 3; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          const dateKey = formatDate(day);

          const recordSnap = await getDoc(doc(db, "dailyRecords", dateKey));
          const studentData = recordSnap.exists()
            ? recordSnap.data().students?.[uid]
            : null;

          temp.push({
            date: dateKey,
            submitted: studentData?.submitted || false,
            formData: studentData?.formData || {},
          });
        }

        setData(temp);
      } catch (err) {
        console.error("Failed to load summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [uid]);

  if (loading) return <div className="bg-gray-100 p-4 rounded shadow">Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">{name}</h3>
      <table className="text-sm w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{entry.date}</td>
              <td className="border px-2 py-1 text-center">
                {entry.submitted ? "✅ Submitted" : "❌ Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={onExpand}
        className="mt-3 text-blue-600 text-sm hover:underline"
      >
        🔍 View Full Summary
      </button>
    </div>
  );
};

export default StudentMiniSummary;






































// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../context/Me_Firebase";
// import { formFields } from "../../constants/formFields";

// const formatDate = (d = new Date()) => d.toLocaleDateString("en-CA");

// const StudentMiniSummary = ({ uid }) => {
//   const [studentData, setStudentData] = useState(null);
//   const [name, setName] = useState("Loading...");

//   useEffect(() => {
//     const fetchData = async () => {
//       const userDoc = await getDoc(doc(db, "users", uid));
//       if (userDoc.exists()) setName(userDoc.data().name);

//       const today = formatDate();
//       const yesterday = formatDate(new Date(Date.now() - 86400000));

//       const [todayDoc, yestDoc] = await Promise.all([
//         getDoc(doc(db, "dailyRecords", today)),
//         getDoc(doc(db, "dailyRecords", yesterday)),
//       ]);

//       const todayData = todayDoc.exists() ? todayDoc.data()?.students?.[uid] : null;
//       const yestData = yestDoc.exists() ? yestDoc.data()?.students?.[uid] : null;

//       setStudentData({ today: todayData, yesterday: yestData });
//     };

//     fetchData();
//   }, [uid]);

//   return (
//     <div className="bg-white border shadow rounded-lg p-4 min-w-[300px] max-w-sm">
//       <h4 className="font-bold text-indigo-700 mb-2">{name}</h4>
//       <div className="text-sm">
//         <div>
//           <strong>Today:</strong>{" "}
//           {studentData?.today?.submitted ? "✅ Submitted" : "❌ Not Submitted"}
//         </div>
//         <div>
//           <strong>Yesterday:</strong>{" "}
//           {studentData?.yesterday?.submitted ? "✅ Submitted" : "❌ Not Submitted"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentMiniSummary;
