const mongoose = require("mongoose");
const { Schema } = mongoose;
const { formatTime } = require("../utils/timeFormat");

const sentimentSchema = new Schema(
  {
    time: {
      type: String,
      required: [true, "Time is required"],
      set: formatTime,
    },
    sentiment: {
      type: Number,
      required: [true, "Sentiment value is required"],
      min: [0, "Sentiment cannot be less than 0"],
      max: [100, "Sentiment cannot be more than 100"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sentiment", sentimentSchema);
