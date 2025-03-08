const mongoose = require("mongoose");
const { Schema } = mongoose;

const querySchema = new Schema({
  queryId: {
    type: String,
    required: true,
    unique: true,
  },
  queryText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  trend: {
    type: String,
    enum: ["up", "down", "stable"],
    default: "stable",
  },
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    default: "neutral",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Query", querySchema);
