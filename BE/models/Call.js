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
      },
      endTime: {
        type: Date,
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
        keywords: [String],
        topics: [String],
        responseTime: Number,
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Call", callSchema);
