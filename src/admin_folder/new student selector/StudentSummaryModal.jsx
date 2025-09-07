import React from "react";
import { formFields } from "../../constants/formFields";
import { exportSingleStudentToExcel } from "../../utils/exportUtils";

const StudentSummaryModal = ({ student, data, onClose }) => {
  if (!student || !data || data.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] rounded-lg shadow-lg overflow-auto p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          ❌ Close
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          📊 {student.name}'s Full Summary
        </h2>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            onClick={() =>
              exportSingleStudentToExcel(data, formFields, student.name)
            }
          >
            📥 Export to Excel
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full text-sm border border-collapse">
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
      </div>
    </div>
  );
};

export default StudentSummaryModal;
