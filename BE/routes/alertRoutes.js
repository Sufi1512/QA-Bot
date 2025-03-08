const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// Example route
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
