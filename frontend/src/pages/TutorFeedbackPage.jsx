import { useEffect, useState } from "react";
import API from "../api/axios";

const TutorFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await API.get("/feedback/my-tutor");
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("Feedback error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        My Feedback
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !feedbacks.length ? (
        <p className="text-gray-400">
          No feedback available
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f) => (
            <div
              key={f._id}
              className="border p-4 rounded-xl bg-gray-50"
            >
              <p className="text-sm text-gray-500">
                Student: {f.student?.name}
              </p>

              <p className="text-sm text-gray-500">
                Course: {f.course?.name}
              </p>

              <p className="text-sm text-gray-500">
                Batch: {f.batch?.name}
              </p>

              <p className="mt-2 font-medium">
                Rating: ⭐ {f.rating}/5
              </p>

              <p className="mt-2">{f.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorFeedbackPage;