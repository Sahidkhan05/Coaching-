const express = require("express");
const router = express.Router();

const {
  saveFeedback,
  getFeedbackByBatch,
  getMyFeedback,
  getMyTutorFeedback, 
} = require("../controllers/feedback.controller");

const { verifyToken, allowRoles } = require("../middlewares/auth.middleware");

/* ================= STUDENT ================= */

router.get(
  "/my",
  verifyToken,
  allowRoles("student"),
  getMyFeedback
);

/* ================= TUTOR ================= */

router.get(
  "/my-tutor", 
  verifyToken,
  allowRoles("tutor"),
  getMyTutorFeedback
);

/* ================= ADMIN / HR ================= */

router.post(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  saveFeedback
);

router.get(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  getFeedbackByBatch
);

module.exports = router;