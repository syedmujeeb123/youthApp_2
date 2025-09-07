import React from "react";
import { formFields } from "../../constants/formFields";
import { exportSingleStudentToExcel } from "../../utils/exportUtils"; // You can define this

const StudentCardFullscreen = ({ student, onClose }) => {
  const { uid, name, todayData, yesterdayData } = student;

  const exportData = () => {
    exportSingleStudentToExcel(uid, name, todayData, yesterdayData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ✖ Close
        </button>

        <h2 className="text-xl font-bold mb-4">📋 Detailed Summary: {name}</h2>

        <table className="w-full text-sm border border-collapse mb-4">
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
            {todayData ? (
              <tr>
                <td className="border px-3 py-2 font-medium">Today</td>
                {formFields.map((field) => (
                  <td key={field} className="border px-3 py-2 text-center">
                    {todayData.formData?.[field]?.value || "-"}
                  </td>
                ))}
                <td className="border px-3 py-2 text-center">
                  {todayData.submittedAt?.toLocaleTimeString() || "-"}
                </td>
              </tr>
            ) : (
              <tr>
                <td className="border px-3 py-2 font-medium">Today</td>
                <td colSpan={formFields.length + 1} className="text-center text-gray-500">
                  ❌ Not submitted today.
                </td>
              </tr>
            )}

            {yesterdayData ? (
              <tr>
                <td className="border px-3 py-2 font-medium">Yesterday</td>
                {formFields.map((field) => (
                  <td key={field} className="border px-3 py-2 text-center">
                    {yesterdayData.formData?.[field]?.value || "-"}
                  </td>
                ))}
                <td className="border px-3 py-2 text-center">
                  {yesterdayData.submittedAt?.toLocaleTimeString() || "-"}
                </td>
              </tr>
            ) : (
              <tr>
                <td className="border px-3 py-2 font-medium">Yesterday</td>
                <td colSpan={formFields.length + 1} className="text-center text-gray-500">
                  ❌ Not submitted yesterday.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          onClick={exportData}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          📥 Export to Excel
        </button>
      </div>
    </div>
  );
};

export default StudentCardFullscreen;
