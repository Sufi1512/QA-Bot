const mongoose = require("mongoose");
const { Schema } = mongoose;

const basicInfoSchema = new Schema({
  description: {
    type: String,
  },
  industry: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  foundedYear: {
    type: Number,
  },
  employeeCount: {
    type: Number,
  },
  missionStatement: {
    type: String,
  },
  complianceStandards: [
    {
      type: String,
    },
  ],
  trainingPrograms: [
    {
      type: String,
    },
  ],
  performanceGoals: [
    {
      type: String,
    },
  ],
});

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    basicInfo: {
      type: basicInfoSchema,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
