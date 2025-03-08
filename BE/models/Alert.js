const mongoose = require("mongoose");
const { Schema } = mongoose;

const alertSchema = new Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "Compliance Risk",
      "Sentiment Drop",
      "Long Pause",
      "Negative Feedback",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Resolved"],
    default: "New",
  },
  agentId: {
    type: String,
  },
  callId: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alert", alertSchema);
