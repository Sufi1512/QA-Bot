const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");

// Example route
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
