import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";
import { getCourses } from "../api/courseApi";
import { getTutors } from "../api/tutorApi";
import { getBatches } from "../api/batchApi";
import {
  Users,
  BookOpen,
  GraduationCap,
  Layers,
} from "lucide-react";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    tutors: 0,
    batches: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "admin" || role === "hr") {
          const [sRes, cRes, tRes, bRes] = await Promise.all([
            getStudents(),
            getCourses(),
            getTutors(),
            getBatches(),
          ]);

          setStats({
            students: sRes.data?.data?.length || 0,
            courses: cRes.data?.data?.length || 0,
            tutors: tRes.data?.data?.length || 0,
            batches: bRes.data?.data?.length || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ===== HEADER ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {role} Dashboard
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Welcome back! Here’s your system overview.
        </p>
      </div>

      {/* ================= ADMIN / HR VIEW ================= */}
      {(role === "admin" || role === "hr") && (
        <>
          {/* ===== STAT CARDS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Students"
              value={stats.students}
              icon={<Users size={28} />}
              loading={loading}
            />
            <StatCard
              title="Courses"
              value={stats.courses}
              icon={<BookOpen size={28} />}
              loading={loading}
            />
            <StatCard
              title="Tutors"
              value={stats.tutors}
              icon={<GraduationCap size={28} />}
              loading={loading}
            />
            <StatCard
              title="Batches"
              value={stats.batches}
              icon={<Layers size={28} />}
              loading={loading}
            />
          </div>

          {/* ===== ANALYTICS SECTION ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

            {/* Bar Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6">
                System Analytics
              </h2>

              <Bar
                label="Students"
                value={stats.students}
                color="bg-blue-500"
              />
              <Bar
                label="Tutors"
                value={stats.tutors}
                color="bg-green-500"
              />
              <Bar
                label="Courses"
                value={stats.courses}
                color="bg-purple-500"
              />
              <Bar
                label="Batches"
                value={stats.batches}
                color="bg-orange-500"
              />
            </div>

            {/* Insights Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-6">
                Quick Insights
              </h2>

              <ul className="space-y-4 text-gray-600 text-sm">
                <li className="flex justify-between">
                  <span>Total Students</span>
                  <span className="font-semibold">
                    {stats.students}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Active Courses</span>
                  <span className="font-semibold">
                    {stats.courses}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total Tutors</span>
                  <span className="font-semibold">
                    {stats.tutors}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Running Batches</span>
                  <span className="font-semibold">
                    {stats.batches}
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </>
      )}

      {/* ================= TUTOR VIEW ================= */}
      {role === "tutor" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Welcome to Tutor Panel
          </h2>
          <p className="text-gray-500">
            Please use the sidebar to manage your timetable and feedback.
          </p>
        </div>
      )}

      {/* ================= STUDENT VIEW ================= */}
      {role === "student" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Welcome to Student Panel
          </h2>
          <p className="text-gray-500">
            Please use the sidebar to view your timetable, feedback and fees.
          </p>
        </div>
      )}
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, loading }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition duration-300">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {loading ? "—" : value}
      </h2>
    </div>
    <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
      {icon}
    </div>
  </div>
);

/* ================= BAR COMPONENT ================= */

const Bar = ({ label, value, color }) => {
  const percentage = Math.min(value * 10, 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded-full">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardPage;