import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

/* ADMIN + HR */
import StudentsPage from "./pages/StudentsPage";
import TutorsPage from "./pages/TutorsPage";
import CoursesPage from "./pages/CoursesPage";
import VisitorsPage from "./pages/VisitorsPage";
import Batches from "./pages/Batches";
import Skills from "./pages/Skills";
import Fees from "./pages/Fees";
import BatchMapping from "./pages/BatchMapping";
import TimeTable from "./pages/TimeTable";
import Reports from "./pages/Reports";
import Attendance from "./pages/Attendance";
import Feedback from "./pages/Feedback";

/* STUDENT */
import StudentFees from "./pages/StudentFees";
import StudentFeedback from "./pages/StudentFeedback";
import StudentTimetable from "./pages/StudentTimetable";

/* TUTOR */
import TutorTimeTable from "./pages/TutorTimeTable";
import TutorFeedbackPage from "./pages/TutorFeedbackPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED LAYOUT */}
        <Route
          path="/*"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "hr", "tutor", "student", "staff"]}
            >
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto p-6">
                  <Routes>

                    {/* ================= DASHBOARDS ================= */}
                    <Route path="admin/dashboard" element={<DashboardPage />} />
                    <Route path="hr/dashboard" element={<DashboardPage />} />
                    <Route path="tutor/dashboard" element={<DashboardPage />} />
                    <Route path="student/dashboard" element={<DashboardPage />} />

                    {/* ================= ADMIN + HR ================= */}

                    <Route
                      path="admin/students"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <StudentsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/tutors"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <TutorsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/courses"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <CoursesPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/visitors"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <VisitorsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/batches"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Batches />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/skills"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Skills />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/fee"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Fees />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/batch-map"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <BatchMapping />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/time-table"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <TimeTable />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/attendance"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Attendance />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/feedback"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Feedback />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="admin/reports"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "hr"]}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />

                    {/* ================= TUTOR ================= */}

                    <Route
                      path="tutor/time-table"
                      element={
                        <ProtectedRoute allowedRoles={["tutor"]}>
                          <TutorTimeTable />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="tutor/feedback"
                      element={
                        <ProtectedRoute allowedRoles={["tutor"]}>
                          <TutorFeedbackPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* ================= STUDENT ================= */}

                    <Route
                      path="student/timetable"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentTimetable />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="student/feedback"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentFeedback />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="student/fees"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentFees />
                        </ProtectedRoute>
                      }
                    />

                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;