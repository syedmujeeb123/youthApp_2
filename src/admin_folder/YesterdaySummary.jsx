import { useEffect, useState } from "react";
import { useFirebase } from "../context/Me_Firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../context/Me_Firebase";

import { formFields } from "../constants/formFields";
import { exportWithStatusToExcel } from "../utils/exportUtils";



const taskList = formFields;

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

const YesterdaySummary = () => {
  const [submitted, setSubmitted] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateKey = formatDate(yesterday);
  const displayDate = yesterday.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

        const docRef = doc(db, "dailyRecords", dateKey);
        const docSnap = await getDoc(docRef);
        const studentMap = docSnap.exists() ? docSnap.data().students || {} : {};

        const submittedList = [];
        const pendingList = [];

        allUsers.forEach(user => {
          const record = studentMap[user.uid];
          if (record?.submitted) {
            submittedList.push({
              uid: user.uid,
              name: user.name,
              submittedAt: record.submittedAt?.toDate?.(),
              formData: record.formData || {},
            });
          } else {
            pendingList.push({ uid: user.uid, name: user.name });
          }
        });

        setSubmitted(submittedList);
        setPending(pendingList);
      } catch (err) {
        console.error("Failed to fetch yesterday summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [dateKey]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 overflow-auto">
      <h2 className="text-lg font-bold mb-4 text-indigo-700">
        📅 Yesterday's Summary: {displayDate}
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mb-8 overflow-x-auto">
            <h3 className="font-semibold text-green-600 mb-2">
              ✅ Submitted ({submitted.length})
            </h3>
            {submitted.length === 0 ? (
              <p className="text-sm text-gray-500">No submissions yesterday.</p>
            ) : (
              <table className="min-w-[800px] w-full text-sm border border-collapse">
                <thead>
                  <tr className="bg-green-100 text-gray-700">
                    <th className="border px-4 py-2 text-left">Name</th>
                    {taskList.map((task) => (
                      <th key={task} className="border px-2 py-2 text-left">
                        {task.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="border px-2 py-2 text-left">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submitted.map((student) => (
                    <tr key={student.uid} className="border-b hover:bg-green-50">
                      <td className="border px-4 py-2">{student.name}</td>
                      {taskList.map((task) => (
                        <td key={task} className="border px-2 py-2">
                          {student.formData?.[task]?.value || "-"}
                        </td>
                      ))}
                      <td className="border px-2 py-2">
                        {student.submittedAt
                          ? student.submittedAt.toLocaleTimeString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>






            )}


          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">
              ❌ Pending ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <p className="text-sm text-gray-500">Everyone submitted 🎉</p>
            ) : (
              <ul className="text-sm list-disc list-inside">
                {pending.map((user) => (
                  <li key={user.uid}>{user.name}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
      <div className="flex justify-end   mt-4">

        <button
          onClick={() =>
            exportWithStatusToExcel(submitted, pending, formFields, `yesterday ${displayDate}`)
          }
          className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          📥 Export to Excel
        </button>
      </div>

    </div>
  );
};

export default YesterdaySummary;


















































// import { useEffect, useState } from "react";
// import { useFirebase } from "../context/Me_Firebase";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../context/Me_Firebase";

// import { formFields } from "../constants/formFields";
// const fieldLabels=formFields
// const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

// const YesterdaySummary = () => {
//   const [submitted, setSubmitted] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const dateKey = formatDate(yesterday);
//   const displayDate = yesterday.toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const usersSnap = await getDocs(collection(db, "users"));
//         const allUsers = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

//         const docRef = doc(db, "dailyRecords", dateKey);
//         const docSnap = await getDoc(docRef);
//         const studentMap = docSnap.exists() ? docSnap.data().students || {} : {};

//         const submittedList = [];
//         const pendingList = [];

//         allUsers.forEach(user => {
//           const record = studentMap[user.uid];
//           if (record?.submitted) {
//             submittedList.push({
//               uid: user.uid,
//               name: user.name,
//               submittedAt: record.submittedAt?.toDate?.(),
//               formData: record.formData || {},
//             });
//           } else {
//             pendingList.push({ uid: user.uid, name: user.name });
//           }
//         });

//         setSubmitted(submittedList);
//         setPending(pendingList);
//       } catch (err) {
//         console.error("Failed to fetch yesterday summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [dateKey]);

//   // Dynamically get all fields from formData
//   const taskList = Array.from(
//     new Set(submitted.flatMap((student) => Object.keys(student.formData || {})))
//   );

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mt-6 overflow-auto">
//       <h2 className="text-lg font-bold mb-4 text-indigo-700">📅 Yesterday's Summary: {displayDate}</h2>

//       {loading ? (
//         <p className="text-sm text-gray-500">Loading...</p>
//       ) : (
//         <>
//           <div className="mb-8 overflow-x-auto">
//             <h3 className="font-semibold text-green-600 mb-2">✅ Submitted ({submitted.length})</h3>
//             {submitted.length === 0 ? (
//               <p className="text-sm text-gray-500">No submissions yesterday.</p>
//             ) : (
//               <table className="min-w-[800px] w-full text-sm border border-collapse">
//                 <thead>
//                   <tr className="bg-green-100 text-gray-700">
//                     <th className="border px-4 py-2 text-left">Name</th>
//                     {taskList.map((task) => (
//                       <th key={task} className="border px-2 py-2 text-left">
//                         {fieldLabels?.[task] || task.replace(/_/g, " ")}
//                       </th>
//                     ))}
//                     <th className="border px-2 py-2 text-left">Submitted At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {submitted.map((student) => (
//                     <tr key={student.uid} className="border-b hover:bg-green-50">
//                       <td className="border px-4 py-2">{student.name}</td>
//                       {taskList.map((task) => (
//                         <td key={task} className="border px-2 py-2">
//                           {student.formData?.[task]?.value || "-"}
//                         </td>
//                       ))}
//                       <td className="border px-2 py-2">
//                         {student.submittedAt
//                           ? student.submittedAt.toLocaleTimeString()
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           <div>
//             <h3 className="font-semibold text-red-600 mb-2">❌ Pending ({pending.length})</h3>
//             {pending.length === 0 ? (
//               <p className="text-sm text-gray-500">Everyone submitted 🎉</p>
//             ) : (
//               <ul className="text-sm list-disc list-inside">
//                 {pending.map((user) => (
//                   <li key={user.uid}>{user.name}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default YesterdaySummary;















































// import { useEffect, useState } from "react";
// import { useFirebase } from "../context/Me_Firebase";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../context/Me_Firebase";


// const formatDate = (date = new Date()) => {
//   return date.toLocaleDateString("en-CA"); // returns YYYY-MM-DD
// };

// const YesterdaySummary = () => {
//   const { user } = useFirebase();
//   const [submitted, setSubmitted] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Get yesterday's date
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const dateKey = formatDate(yesterday); // YYYY-MM-DD
//   const displayDate = yesterday.toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }); // e.g., Monday, 15 July 2025

//   useEffect(() => {
//     const fetchSummary = async () => {
//       setLoading(true);

//       try {
//         const usersSnap = await getDocs(collection(db, "users"));
//         const allUsers = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

//         const docRef = doc(db, "dailyRecords", dateKey);
//         const docSnap = await getDoc(docRef);

//         const submittedList = [];
//         const pendingList = [];

//         const studentMap = docSnap.exists() ? docSnap.data().students || {} : {};

//         allUsers.forEach(user => {
//           if (studentMap[user.uid]?.submitted) {
//             submittedList.push({ uid: user.uid, name: user.name });
//           } else {
//             pendingList.push({ uid: user.uid, name: user.name });
//           }
//         });

//         setSubmitted(submittedList);
//         setPending(pendingList);
//       } catch (err) {
//         console.error("Failed to fetch yesterday summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [dateKey]);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//       <h2 className="text-lg font-bold mb-4 text-indigo-700">
//         📅 Yesterday's Summary – {displayDate}
//       </h2>
//       {loading ? (
//         <p className="text-sm text-gray-500">Loading...</p>
//       ) : (
//         <>
//           <div className="mb-4">
//             <h3 className="font-semibold text-green-600 mb-2">✅ Submitted ({submitted.length})</h3>
//             <ul className="text-sm list-disc list-inside">
//               {submitted.map((user) => (
//                 <li key={user.uid}>{user.name}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-red-600 mb-2">❌ Pending ({pending.length})</h3>
//             <ul className="text-sm list-disc list-inside">
//               {pending.map((user) => (
//                 <li key={user.uid}>{user.name}</li>
//               ))}
//             </ul>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default YesterdaySummary;