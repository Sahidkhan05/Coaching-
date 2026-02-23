const express = require("express");
const router = express.Router();

const { createUserByAdmin } = require("../controllers/admin.controller");
const {
  verifyToken,
  isAdmin,       // ya allowRoles
} = require("../middlewares/auth.middleware");

// Admin → Create Student / Tutor / HR
router.post(
  "/create-user",
  verifyToken,
  isAdmin,
  createUserByAdmin
);

module.exports = router;
