const express = require("express");
const router = express.Router();

const {
  
  login,
} = require("../controllers/auth.controller");

// test route (debug ke liye)
router.get("/test", (req, res) => {
  res.send("Auth route working ✅");
});


router.post("/login", login);

module.exports = router;
