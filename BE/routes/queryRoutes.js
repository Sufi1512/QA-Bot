const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

// Example route
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
