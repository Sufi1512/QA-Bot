const mongoose = require("mongoose");
const { Schema } = mongoose;

const callSchema = new Schema(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    agentId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
      set: (v) => new Date(v),
      get: (v) => v?.toISOString() || null,
    },
    endTime: {
      type: Date,
      default: null,
      set: (v) => (v ? new Date(v) : null),
      get: (v) => v?.toISOString() || null,
    },
    duration: {
      type: Number,
    },
    transcript: {
      type: String,
    },
    sentimentScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    resolutionStatus: {
      type: String,
      enum: ["Resolved", "Unresolved", "In Progress"],
      default: "In Progress",
    },
    metadata: {
      type: {
        keywords: { type: [String], default: [] },
        topics: { type: [String], default: [] },
        responseTime: { type: Number, default: 0 },
      },
      default: { keywords: [], topics: [], responseTime: 0 },
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("Call", callSchema);
