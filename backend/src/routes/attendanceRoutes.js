const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/save", attendanceController.saveAttendance);
router.get("/", attendanceController.getAttendanceByBatch);
router.get("/by-date", attendanceController.getAttendanceByDate);

module.exports = router; // 🔥 VERY IMPORTANT
