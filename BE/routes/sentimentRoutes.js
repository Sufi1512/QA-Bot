// routes/sentimentRoutes.js
const express = require("express");
const router = express.Router();
const Sentiment = require("../models/Sentiment");

router.get("/", async (req, res) => {
  try {
    const sentiments = await Sentiment.find()
      .sort({ time: 1 })
      .select("time sentiment -_id")
      .lean();
    res.json(sentiments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sentiments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { time, sentiment } = req.body;

    if (
      !time ||
      typeof sentiment !== "number" ||
      sentiment < 0 ||
      sentiment > 100
    ) {
      return res.status(400).json({
        message:
          "Invalid input. Time required and sentiment must be between 0-100",
      });
    }

    const newSentiment = await Sentiment.create({ time, sentiment });
    res.status(201).json(newSentiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
