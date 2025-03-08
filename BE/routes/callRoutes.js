const express = require("express");
const router = express.Router();
const Call = require("../models/Call");

// @route   GET api/calls
// @desc    Get all calls
// @access  Public
// router.get("/", async (req, res) => {
//   try {
//     const calls = await Call.find();
//     res.json(calls);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// @route   POST api/calls
// @desc    Add a new call
// @access  Public
router.post("/", async (req, res) => {
  const newCall = new Call(req.body);

  try {
    const call = await newCall.save();
    res.status(201).json(call);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT api/calls/:id
// @desc    Update a call
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    let call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call = await Call.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(call);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE api/calls/:id
// @desc    Delete a call
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    res.json({ message: "Call deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/", (req, res) => {
  res.send("Calls route");
});
module.exports = router;
