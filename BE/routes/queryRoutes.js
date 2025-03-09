const express = require("express");
const router = express.Router();
const Query = require("../models/Query");
const Topic = require("../models/Topic");

// Get all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
