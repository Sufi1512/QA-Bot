// routes/agentRoutes.js
const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");

// Get all agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle agent active status
router.patch("/:id/toggle-active", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    agent.isActive = !agent.isActive;
    await agent.save();

    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle invalid JSON responses
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err);
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next();
});

module.exports = router;
