import React from "react";

const StudentMiniCard = ({ student, data, onViewFull }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full sm:w-[48%] lg:w-[30%] xl:w-[24%]">
      <h3 className="text-indigo-700 font-semibold text-base mb-2">{student.name}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{entry.date}</td>
                <td className="border px-2 py-1 text-center">
                  {entry.submitted ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-3">
        <button
          onClick={() => onViewFull(student, data)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
        >
          🔍 View Full Summary
        </button>
      </div>
    </div>
  );
};

export default StudentMiniCard;
