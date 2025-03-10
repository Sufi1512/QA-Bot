const mongoose = require("mongoose");
const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
