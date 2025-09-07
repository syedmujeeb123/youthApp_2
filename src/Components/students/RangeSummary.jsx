import { useEffect, useState } from "react";
import { useFirebase } from "../../context/Me_Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../context/Me_Firebase";
import { formFields } from "../../constants/formFields";
import { exportWithStatusToExcel } from "../../utils/exportUtils";

const formatDateKey = (date) => date.toLocaleDateString("en-CA");
const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

const RangeSummary = () => {
  const { user } = useFirebase();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!startDate || !endDate || !user) return;
    setLoading(true);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];

    while (start <= end) {
      const dateKey = formatDateKey(start);
      const displayDate = formatDisplayDate(start);
      const docSnap = await getDoc(doc(db, "dailyRecords", dateKey));
      const studentRecord = docSnap.exists() ? docSnap.data()?.students?.[user.uid] : null;

      if (studentRecord?.submitted) {
        result.push({
          date: displayDate,
          submitted: true,
          formData: studentRecord.formData || {},
          submittedAt: studentRecord.submittedAt?.toDate?.().toLocaleTimeString() || "-",
        });
      } else {
        result.push({ date: displayDate, submitted: false });
      }

      start.setDate(start.getDate() + 1);
    }

    setSummary(result);
    setLoading(false);
  };

  const handleExport = () => {
    const submitted = summary
      .filter((entry) => entry.submitted)
      .map((entry) => ({
        uid: user.uid,
        name: user.displayName || user.email || "Student",
        submittedAt: entry.submittedAt,
        formData: entry.formData,
        date: entry.date,
      }));

    const pending = summary
      .filter((entry) => !entry.submitted)
      .map((entry) => ({
        uid: user.uid,
        name: user.displayName || user.email || "Student",
        date: entry.date,
      }));

    exportWithStatusToExcel(submitted, pending, formFields, `CustomRange_${startDate}_to_${endDate}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">📅 Custom Range Summary</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <button
          onClick={handleFetch}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          🔍 View Summary
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : summary.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  {formFields.map((field) => (
                    <th key={field} className="border px-3 py-2">
                      {field.replace(/_/g, " ")}
                    </th>
                  ))}
                  <th className="border px-3 py-2">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((entry, idx) => (
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
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleExport}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
            >
              📥 Export to Excel
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">No data found for selected range.</p>
      )}
    </div>
  );
};

export default RangeSummary;
