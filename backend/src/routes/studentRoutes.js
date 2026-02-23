const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Create student
router.post("/", addStudent);

// Get students (filter + sort + pagination)
router.get("/", getStudents);

// Update student
router.put("/:id", updateStudent);

// Soft delete student
router.delete("/:id", deleteStudent);

module.exports = router;
