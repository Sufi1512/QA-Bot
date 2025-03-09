// models/Sentiment.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const sentimentSchema = new Schema(
  {
    time: {
      type: String,
      required: [true, "Time is required"],
      validate: {
        validator: function (v) {
          // Only validate final format after middleware processing
          return /^([0-2][0-9]):([0-5][0-9])$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
      set: function (v) {
        // Normalize time format to HH:mm
        const [hours, minutes] = v.split(":");
        return `${hours.padStart(2, "0")}:${minutes}`;
      },
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
