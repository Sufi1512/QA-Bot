// routes/sentimentRoutes.js
const express = require("express");
const router = express.Router();
const Sentiment = require("../models/Sentiment");
const timeFormatMiddleware = require("../middleware/timeFormatMiddleware");

router.get("/", async (req, res) => {
  try {
    const sentiments = await Sentiment.find()
      .sort({ time: 1 })
      .select("-__v -createdAt -updatedAt")
      .lean()
      .exec();

    // Format times consistently before sending
    const formattedSentiments = sentiments.map((s) => ({
      ...s,
      time: s.time.padStart(5, "0"), // Ensure HH:mm format
    }));

    res.json(formattedSentiments);
  } catch (error) {
    console.error("Error fetching sentiments:", error);
    res.status(500).json({ message: "Failed to fetch sentiments" });
  }
});

// Apply middleware to POST requests
router.post("/", timeFormatMiddleware, async (req, res) => {
  try {
    const { time, sentiment } = req.body;

    // Basic validation
    if (!time || typeof sentiment !== "number") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Extract hours and minutes, ignoring seconds if present
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})/);
    if (!timeMatch) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    const normalizedTime = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;

    const newSentiment = new Sentiment({
      time: normalizedTime,
      sentiment,
    });

    const saved = await newSentiment.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error creating sentiment:", error);
    res.status(500).json({ message: "Failed to create sentiment" });
  }
});

module.exports = router;
