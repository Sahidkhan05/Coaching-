const express = require("express");
const router = express.Router();

const {
  addBatchMapping,
  getBatchMappings,
  updateBatchMapping,
  deleteBatchMapping,
  getBatchStudents,
} = require("../controllers/batchMappingController");

router.post("/", addBatchMapping);
router.get("/students", getBatchStudents);
router.get("/", getBatchMappings);
router.put("/:id", updateBatchMapping);
router.delete("/:id", deleteBatchMapping);



module.exports = router;
