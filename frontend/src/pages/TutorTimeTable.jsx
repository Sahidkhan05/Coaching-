import { useEffect, useState } from "react";
import API from "../api/axios";
import { Clock, TurkishLira } from "lucide-react";

const formatTime = (time) => {
  if (!time) return "-";
  const [hour, minute] = time.split(":");
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minute} ${ampm}`;
};

const TutorTimeTable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await API.get("/timetables/my-tutor");
        setTimetables(res.data || []);
      } catch (err) {
        console.error("Timetable error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="text-blue-600" />
        <h2 className="text-xl font-semibold">My Timetable</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !timetables.length ? (
        <div className="text-center py-10 text-gray-400">
          No timetable assigned yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="p-4 text-left">Course</th>
                <th className="p-4 text-left">Batch</th>
                <th className="p-4 text-left">Day</th>
                <th className="p-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{t.course?.name}</td>
                  <td className="p-4">{t.batch?.name}</td>
                  <td className="p-4">{t.day || "-"}</td>
                  <td className="p-4 text-blue-600 font-semibold">
                    {formatTime(t.startTime)} - {formatTime(t.endTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TutorTimeTable ;