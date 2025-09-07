import React, { useState } from "react";
import DailySummary from "./DailySummary";
import SevenDaySummary from "./SevenDaySummary";
import RangeSummary from "./RangeSummary";

const StudentSummaryIndividual = () => {
  const [showDaily, setShowDaily] = useState(true);
  const [showWeekly, setShowWeekly] = useState(false);
  const [showRange, setShowRange] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">📋 My Submission Summary</h1>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            showDaily ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setShowDaily(true);
            setShowWeekly(false);
            setShowRange(false);
          }}
        >
          📅 Today & Yesterday
        </button>

        <button
          className={`px-4 py-2 rounded-lg shadow ${
            showWeekly ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setShowDaily(false);
            setShowWeekly(true);
            setShowRange(false);
          }}
        >
          📈 Last 7 Days
        </button>

        <button
          className={`px-4 py-2 rounded-lg shadow ${
            showRange ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setShowDaily(false);
            setShowWeekly(false);
            setShowRange(true);
          }}
        >
          📆 Custom Range
        </button>
      </div>

      {/* Conditionally Rendered Views */}
      {showDaily && <DailySummary />}
      {showWeekly && <SevenDaySummary />}
      {showRange && <RangeSummary />}
    </div>
  );
};

export default StudentSummaryIndividual;
