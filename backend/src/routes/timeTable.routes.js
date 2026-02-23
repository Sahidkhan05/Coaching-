const express = require("express");
const router = express.Router();
const {
  createTimeTable,
  getTimeTables,
  getMyTutorTimeTable,
  getMyStudentTimeTable,
  updateTimeTable,
  deleteTimeTable,
} = require("../controllers/timeTable.controller");

const { verifyToken, allowRoles } = require("../middlewares/auth.middleware");


//* ================= TUTOR ================= */
router.get(
  "/my-tutor",
  verifyToken,
  allowRoles("tutor"),
  getMyTutorTimeTable
);

/* ================= STUDENT ================= */
router.get(
  "/my-student",
  verifyToken,
  allowRoles("student"),
  getMyStudentTimeTable
);

/* ================= ADMIN / HR ================= */
router.post("/", verifyToken, allowRoles("admin","hr"), createTimeTable);

router.get("/", verifyToken, allowRoles("admin","hr"), getTimeTables);

router.put("/:id", verifyToken, allowRoles("admin","hr"), updateTimeTable);

router.delete("/:id", verifyToken, allowRoles("admin","hr"), deleteTimeTable);

module.exports = router;
