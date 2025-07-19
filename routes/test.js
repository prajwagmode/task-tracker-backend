// routes/test.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware"); // Make sure this file exists!

router.post("/testjson", authenticate, (req, res) => {
  res.json({
    message: "Received",
    body: req.body,
  });
});

module.exports = router;
