const express = require("express");
const router = express.Router();

const {
  addTutor,
  getTutors,
  updateTutor,
  deleteTutor,
  getTutorsByCourse,   
} = require("../controllers/tutorController");

const {
  verifyToken,
  allowRoles,
} = require("../middlewares/auth.middleware");

// ================= EMPLOYEE ROUTES =================

// Add Employee
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  addTutor
);

// Get Employees (filter + pagination)
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  getTutors
);

// 🔥 NEW ROUTE - Get Tutors by Course
router.get(
  "/by-course/:courseId",
  verifyToken,
  allowRoles("admin", "hr"),
  getTutorsByCourse
);

// Update
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "hr"),
  updateTutor
);

// Soft Delete
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "hr"),
  deleteTutor
);

module.exports = router;