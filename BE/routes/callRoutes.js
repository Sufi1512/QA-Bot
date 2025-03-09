// routes/callRoutes.js
const express = require("express");
const router = express.Router();
const Call = require("../models/Call");

// Get all calls
router.get("/", async (req, res) => {
  try {
    const calls = await Call.find();
    res.json(calls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get calls by agent ID
router.get("/agent/:id", async (req, res) => {
  try {
    const calls = await Call.find({ agentId: req.params.id });
    res.json(calls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
