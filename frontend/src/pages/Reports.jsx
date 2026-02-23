import React from "react";
import { FileText, Download } from "lucide-react";

const REPORT_TYPES = [
  { label: "Students", type: "students" },
  { label: "Tutors", type: "tutors" },
  { label: "Courses", type: "courses" },
  { label: "Batches", type: "batches" },
  { label: "Timetables", type: "timetables" },
];

const Reports = () => {
  const handleDownload = async (type) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/${type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download report");
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold">
          Reports Dashboard
        </h1>
        <p className="mt-2 opacity-90">
          Download complete system reports in PDF format
        </p>
      </div>

      {/* ===== REPORT CARDS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {REPORT_TYPES.map((report) => (
          <div
            key={report.type}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 group-hover:bg-blue-200 transition p-3 rounded-xl">
                <FileText className="text-blue-600" size={24} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {report.label} Report
                </h2>
                <p className="text-xs text-gray-500">
                  Download full {report.label.toLowerCase()} data
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(report.type)}
              className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl hover:scale-105 transition-transform duration-200"
            >
              <Download size={18} />
              Download Report
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Reports;
