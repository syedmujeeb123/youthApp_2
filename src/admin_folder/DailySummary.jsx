import { useEffect, useState } from "react";
import { db } from "../context/Me_Firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { formFields } from "../constants/formFields";
import { exportWithStatusToExcel } from "../utils/exportUtils";

const formatDate = (date = new Date()) => date.toLocaleDateString("en-CA");

const fields = formFields;

const DailySummary = () => {
  const [submitted, setSubmitted] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dateKey = formatDate(today);
  const displayDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudents = [];
        const userSnapshot = await getDocs(collection(db, "users"));
        userSnapshot.forEach((doc) => {
          allStudents.push({ uid: doc.id, ...doc.data() });
        });

        const recordDoc = await getDoc(doc(db, "dailyRecords", dateKey));
        const recordData = recordDoc.exists() ? recordDoc.data().students || {} : {};

        const submittedList = [];
        const pendingList = [];

        allStudents.forEach((student) => {
          if (recordData[student.uid]?.submitted) {
            submittedList.push({
              ...student,
              formData: recordData[student.uid].formData || {},
              submittedAt: recordData[student.uid].submittedAt?.toDate?.(),
            });
          } else {
            pendingList.push(student);
          }
        });

        setSubmitted(submittedList);
        setPending(pendingList);
      } catch (error) {
        console.error("Error fetching daily summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateKey]);

  if (loading) return <p className="text-center">⏳ Loading daily summary...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">
        📅 Daily Summary for {displayDate}
      </h2>

      <div className="mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-green-700">✅ Submitted ({submitted.length})</h3>
        {submitted.length === 0 ? (
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        ) : (
          <table className="min-w-[800px] w-full text-sm border border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="border px-3 py-2 text-left">Name</th>
                {fields.map((field) => (
                  <th key={field} className="border px-3 py-2 text-left">
                    {field.replace(/_/g, " ")}
                  </th>
                ))}
                <th className="border px-3 py-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submitted.map((student) => (
                <tr key={student.uid} className="hover:bg-blue-50 border-b">
                  <td className="border px-3 py-2 font-medium">{student.name}</td>
                  {fields.map((field) => (
                    <td key={field} className="border px-3 py-2 text-center">
                      {student.formData?.[field]?.value || "-"}
                    </td>
                  ))}
                  <td className="border px-3 py-2">
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
        <h3 className="text-lg font-semibold text-red-700">❌ Pending ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">Everyone submitted 🎉</p>
        ) : (
          <ul className="list-disc pl-6 mt-1 text-sm text-gray-700">
            {pending.map((p) => (
              <li key={p.uid}>{p.name}</li>
            ))}
          </ul>
        )}
      </div>


        







            <div className="flex justify-end   mt-4">
            
                  <button
                    onClick={() =>
                      exportWithStatusToExcel(submitted, pending, formFields, `Today ${displayDate}`)
                    }
                    className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                    >
                    📥 Export to Excel
                  </button>
                    </div>
            







                </div>


  );
};

export default DailySummary;

















































