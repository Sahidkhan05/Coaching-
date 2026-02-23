const express = require("express");
const router = express.Router();

const {
  addBatch,
  getBatches,
  updateBatch,
  deleteBatch,
} = require("../controllers/batchController");

// Create batch
router.post("/", addBatch);

// Get batches (filter + sort + pagination)
router.get("/", getBatches);

// Update batch
router.put("/:id", updateBatch);

// Soft delete batch
router.delete("/:id", deleteBatch);

module.exports = router;
