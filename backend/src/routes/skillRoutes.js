const express = require("express");
const router = express.Router();

const {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const {
  verifyToken,
  allowRoles,
} = require("../middlewares/auth.middleware");

// ================= SKILL ROUTES =================

//  Add skill (admin / hr)
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  addSkill
);

//  Get skills (pagination + filter + sort)
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "hr"),
  getSkills
);

// ✏️ Update skill
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "hr"),
  updateSkill
);

//  Delete skill (soft delete)
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "hr"),
  deleteSkill
);

module.exports = router;
