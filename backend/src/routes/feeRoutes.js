const express = require("express");
const router = express.Router();

const {
  createFee,
  addInstallment,
  getFees,
  deleteInstallment,
  getMyFees,
  deleteFee,
} = require("../controllers/feeController");

const {
  verifyToken,
  allowRoles,
} = require("../middlewares/auth.middleware");

/* ================= STUDENT ROUTE ================= */
router.get(
  "/my",
  verifyToken,
  allowRoles("student"),
  getMyFees
);

/* ================= ADMIN ROUTES ================= */

// CREATE FEE
router.post("/", createFee);

// GET ALL FEES
router.get("/", getFees);

// ADD INSTALLMENT (Use PUT — more correct REST)
router.put("/:id/installment", addInstallment);

// DELETE FULL FEE
router.delete("/:id", deleteFee);

// DELETE INSTALLMENT
router.delete("/:feeId/installment/:installmentId", deleteInstallment);

module.exports = router;