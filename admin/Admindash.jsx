import { useState } from "react";
import DailySummary from "../src/admin_folder/DailySummary";
import YesterdaySummary from "../src/admin_folder/YesterdaySummary";
import WeeklySummary from "../src/admin_folder/WeeklySummary";
import StudentComparisonDashboard from "../src/admin_folder/new student selector/StudentComparisonDashboard";
import MultiStudentSummary from "../src/admin_folder/new student selector/MultiStudentSummary";
const Admindash = () => {
  const [activeTab, setActiveTab] = useState("daily"); // Default shown tab

  const renderTabContent = () => {
  switch (activeTab) {
    case "daily":
      return <DailySummary />;
    case "yesterday":
      return <YesterdaySummary />;
    case "weekly":
      return <WeeklySummary />;
    case "studentSummary":
      return <StudentComparisonDashboard />;
    // case "multiStudent": // ✅ handle new tab
    //   return <MultiStudentSummary />;
    default:
      return null;
  }
};


 const tabs = [
  { key: "daily", label: "📅 Today" },
  { key: "yesterday", label: "📆 Yesterday" },
  { key: "weekly", label: "📈 Weekly" },
  { key: "studentSummary", label: "📋 Student Summary" },
  // { key: "multiStudent", label: "👥 Compare Students" }, // ✅ new tab
];


  return (
  <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">📊 Admin Dashboard</h1>

    {/* Link to Pending Users */}
    <div className="flex justify-end mb-4">
      <a
        href="/admin/pending-users"
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        ⚙️ Manage Pending Users
      </a>
    </div>

    {/* Tab Buttons */}
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 rounded-md font-medium shadow transition
            ${activeTab === tab.key
              ? "bg-blue-700 text-white"
              : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Render Selected Component */}
    <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
      {renderTabContent()}
    </div>
  </div>
);

};

export default Admindash;


