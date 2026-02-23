const express = require("express");
const router = express.Router();
const { downloadReport } = require("../controllers/report.controller");
const { verifyToken, allowRoles } = require("../middlewares/auth.middleware");


router.get(
  "/:type",
  verifyToken,
  allowRoles("admin", "hr"),
  downloadReport
);

module.exports = router;
