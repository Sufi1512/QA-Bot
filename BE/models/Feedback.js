const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  feedbackId: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  callId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
  },
  sentimentAnalysis: {
    overallSentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },
    keywords: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
