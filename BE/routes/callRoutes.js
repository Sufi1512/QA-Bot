// routes/callRoutes.js
const express = require("express");
const router = express.Router();
const Call = require("../models/Call");

// Get all calls
router.get("/", async (req, res, next) => {
  try {
    const calls = await Call.find().sort({ startTime: -1 }).lean().exec();

    const sanitizedCalls = calls.map((call) => ({
      ...call,
      startTime: call.startTime?.toISOString() || null,
      endTime: call.endTime?.toISOString() || null,
      metadata: {
        keywords: call.metadata?.keywords || [],
        topics: call.metadata?.topics || [],
        responseTime: call.metadata?.responseTime || 0,
      },
    }));

    res.json(sanitizedCalls);
  } catch (err) {
    next(err);
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
