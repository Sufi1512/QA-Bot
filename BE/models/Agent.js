const mongoose = require("mongoose");
const { Schema } = mongoose;

const agentSchema = new Schema(
  {
    agentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
    avgSentimentScore: {
      type: Number,
      default: 50,
    },
    avgComplianceScore: {
      type: Number,
      default: 80,
    },
    resolutionRate: {
      type: Number,
      default: 70,
    },
    empathyScore: {
      type: Number,
      default: 70,
    },
    clarityScore: {
      type: Number,
      default: 70,
    },
    efficiencyScore: {
      type: Number,
      default: 70,
    },
    performanceTrends: [
      {
        date: Date,
        sentimentScore: Number,
        complianceScore: Number,
        resolutionRate: Number,
      },
    ],
    score: {
      type: Number,
    },
    calls: {
      type: Number,
    },
    callDuration: {
      type: Number,
    },
    controls: [
      {
        type: String,
        timestamp: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    agentInstructions: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    compliance: {
      type: Number,
    },
    avgTime: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
