import { useEffect, useState } from "react";
import { getMyFeedback } from "../api/feedbackApi";

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyFeedback();
        setFeedback(data || []);
      } catch (err) {
        console.error("Error loading feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">My Feedback</h2>
        <p className="text-sm opacity-90">
          View feedback given by your tutor
        </p>
      </div>

      {/* Content */}
      {!feedback.length ? (
        <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-400">
          No feedback available
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.map((f) => (
            <div
              key={f._id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Course */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  {f.course?.name || "-"}
                </span>

                <span className="text-xs text-gray-400">
                  {f.batch?.name || "-"}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Rating
                </p>

                <div className="text-yellow-500 text-xl">
                  {"★".repeat(f.rating)}
                  {"☆".repeat(5 - f.rating)}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Tutor's Note
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {f.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;