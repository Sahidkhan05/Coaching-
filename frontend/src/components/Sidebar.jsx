import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Clock,
  IndianRupee,
  UserPlus,
  ClipboardCheck,
  FileText,
  LogOut,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();
  const name = user?.name;

  const isAdminOrHr = role === "admin" || role === "hr";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive
        ? "bg-white text-blue-700 shadow-md"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-700 to-indigo-800 text-white p-5 flex flex-col overflow-y-auto">

      {/* ===== Title ===== */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Coaching CRM</h2>
        <p className="text-sm opacity-80 capitalize">
          {role} Panel
        </p>
      </div>

      {/* ===== User Info ===== */}
      <div className="bg-white/10 p-4 rounded-xl mb-6 text-center">
        <p className="text-sm opacity-80">Logged in as</p>
        <p className="font-semibold capitalize">
          {name}
        </p>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 space-y-2">

        {/* ================= ADMIN + HR ================= */}
        {isAdminOrHr && (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/students" className={linkClass}>
              <Users size={18} />
              Students
            </NavLink>

            <NavLink to="/admin/tutors" className={linkClass}>
              <GraduationCap size={18} />
              Tutors
            </NavLink>

            <NavLink to="/admin/courses" className={linkClass}>
              <BookOpen size={18} />
              Courses
            </NavLink>

            <NavLink to="/admin/batches" className={linkClass}>
              <Layers size={18} />
              Batches
            </NavLink>

            <NavLink to="/admin/batch-map" className={linkClass}>
              <Layers size={18} />
              Batch Map
            </NavLink>

            <NavLink to="/admin/time-table" className={linkClass}>
              <Clock size={18} />
              TimeTable
            </NavLink>

            <NavLink to="/admin/fee" className={linkClass}>
              <IndianRupee size={18} />
              Fee
            </NavLink>

            <NavLink to="/admin/visitors" className={linkClass}>
              <UserPlus size={18} />
              Visitors
            </NavLink>

            <NavLink to="/admin/attendance" className={linkClass}>
              <ClipboardCheck size={18} />
              Attendance
            </NavLink>

            <NavLink to="/admin/feedback" className={linkClass}>
              <MessageSquare size={18} />
              Feedback
            </NavLink>

            <NavLink to="/admin/reports" className={linkClass}>
              <FileText size={18} />
              Reports
            </NavLink>
          </>
        )}

        {/* ================= TUTOR ================= */}
        {role === "tutor" && (
          <>
            <NavLink to="/tutor/time-table" className={linkClass}>
              <Clock size={18} />
              My TimeTable
            </NavLink>

            <NavLink to="/tutor/feedback" className={linkClass}>
              <MessageSquare size={18} />
              My Feedback
            </NavLink>
          </>
        )}

        {/* ================= STUDENT ================= */}
        {role === "student" && (
          <>
            <NavLink to="/student/timetable" className={linkClass}>
              <Clock size={18} />
              My TimeTable
            </NavLink>

            <NavLink to="/student/feedback" className={linkClass}>
              <MessageSquare size={18} />
              My Feedback
            </NavLink>

            <NavLink to="/student/fees" className={linkClass}>
              <IndianRupee size={18} />
              My Fees
            </NavLink>
          </>
        )}

      </nav>

      {/* ===== Logout ===== */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-6 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;