const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  addVisitor,
  getVisitors,
  updateVisitor,
  deleteVisitor,
  restoreVisitor,
  convertVisitorToStudent,
} = require("../controllers/visitorController");

const {
  verifyToken,
  allowRoles,
} = require("../middlewares/auth.middleware");

// ================= VISITOR ROUTES =================

// add visitor
router.post("/", verifyToken, allowRoles("admin", "hr"), addVisitor);

// get visitors (list + filters)
router.get("/", verifyToken, allowRoles("admin", "hr"), getVisitors);

// edit visitor (normal update)
router.put("/:id", verifyToken, allowRoles("admin", "hr"), updateVisitor);


// convert visitor → student
router.post(
  "/convert/:id",
  verifyToken,
  allowRoles("admin", "hr"),
  upload.fields([{ name: "photo", maxCount: 1 }]), 
  convertVisitorToStudent
);

// move to trash
router.delete("/:id", verifyToken, allowRoles("admin", "hr"), deleteVisitor);

// restore from trash
router.patch(
  "/:id/restore",
  verifyToken,
  allowRoles("admin", "hr"),
  restoreVisitor
);

module.exports = router;
