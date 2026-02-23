const express = require("express");
const router = express.Router();

const {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Create course
router.post("/", addCourse);

// Get courses (filter + sorting + pagination)
router.get("/", getCourses);

// Get single course
router.get("/:id", getCourseById);

// Update course
router.put("/:id", updateCourse);

// Soft delete course
router.delete("/:id", deleteCourse);

module.exports = router;
