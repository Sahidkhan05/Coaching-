import { useEffect, useState } from "react";
import API from "../api/axios";

const formatTime = (time) => {
  if (!time) return "-";
  const [hour, minute] = time.split(":");
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minute} ${ampm}`;
};

const StudentTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/timetables/my-student");
        setTimetables(res.data || []);
      } catch (err) {
        console.error("Error loading timetable:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">My Timetable</h2>
        <p className="text-sm opacity-90">
          Your upcoming class schedule
        </p>
      </div>

      {!timetables.length ? (
        <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-400">
          No timetable assigned
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timetables.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Day Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full font-medium">
                  {t.day}
                </span>

                <span className="text-sm text-gray-400">
                  {t.batch?.name || "-"}
                </span>
              </div>

              {/* Course */}
              <h3 className="text-lg font-semibold mb-2">
                {t.course?.name || "-"}
              </h3>

              {/* Tutor */}
              <p className="text-sm text-gray-600 mb-3">
                Tutor:{" "}
                <span className="font-medium">
                  {t.tutor?.name || "-"}
                </span>
              </p>

              {/* Time */}
              <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-xl font-medium inline-block">
                {formatTime(t.startTime)} -{" "}
                {formatTime(t.endTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;