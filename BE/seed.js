const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/qamonitoring"
);

// Define Schemas and Models
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    basicInfo: {
      description: String,
      industry: String,
      contactEmail: String,
      contactPhone: String,
      foundedYear: Number,
      employeeCount: Number,
      missionStatement: String,
      complianceStandards: [String],
      trainingPrograms: [String],
      performanceGoals: [String],
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

const agentSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    totalCalls: { type: Number, default: 0 },
    avgSentimentScore: { type: Number, default: 50 },
    avgComplianceScore: { type: Number, default: 80 },
    resolutionRate: { type: Number, default: 70 },
    empathyScore: { type: Number, default: 70 },
    clarityScore: { type: Number, default: 70 },
    efficiencyScore: { type: Number, default: 70 },
    performanceTrends: [
      {
        date: Date,
        sentimentScore: Number,
        complianceScore: Number,
        resolutionRate: Number,
      },
    ],
    score: Number,
    calls: Number,
    callDuration: Number,
    controls: [
      {
        type: { type: String },
        timestamp: { type: Date },
      },
    ],
    isActive: { type: Boolean, default: true },
    agentInstructions: String,
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    compliance: Number,
    avgTime: Number,
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);

const callSchema = new mongoose.Schema(
  {
    callId: { type: String, required: true, unique: true },
    agentId: String,
    customerId: String,
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: Number,
    transcript: String,
    sentimentScore: { type: Number, min: 0, max: 100 },
    complianceScore: { type: Number, min: 0, max: 100 },
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
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

const Call = mongoose.model("Call", callSchema);

const alertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
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
  description: { type: String, required: true },
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
  agentId: String,
  callId: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  createdAt: { type: Date, default: Date.now },
});

const Alert = mongoose.model("Alert", alertSchema);

const querySchema = new mongoose.Schema({
  queryId: { type: String, required: true, unique: true },
  queryText: { type: String, required: true },
  category: { type: String, required: true },
  count: { type: Number, default: 1 },
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
  lastUpdated: { type: Date, default: Date.now },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

const Query = mongoose.model("Query", querySchema);

// Sample Data
const sampleCompanies = [
  {
    name: "Tech Solutions Inc.",
    address: "123 Innovation Drive, Silicon Valley, CA 94089",
    basicInfo: {
      description:
        "A leading technology company providing innovative solutions",
      industry: "Technology",
      contactEmail: "contact@techsolutions.com",
      contactPhone: "+1-408-555-0123",
      foundedYear: 2010,
      employeeCount: 500,
      missionStatement: "To revolutionize technology for a better tomorrow",
      complianceStandards: ["ISO 27001", "GDPR"],
      trainingPrograms: ["Customer Service Excellence", "Technical Training"],
      performanceGoals: [
        "Increase customer satisfaction by 20%",
        "Reduce resolution time by 15%",
      ],
    },
  },
  {
    name: "HealthCare Pro",
    address: "456 Wellness Avenue, Medical Park, NY 10001",
    basicInfo: {
      description: "Providing top-quality healthcare solutions",
      industry: "Healthcare",
      contactEmail: "info@healthcarepro.com",
      contactPhone: "+1-212-555-4321",
      foundedYear: 2015,
      employeeCount: 300,
      missionStatement: "Committed to improving healthcare outcomes",
      complianceStandards: ["HIPAA", "ISO 13485"],
      trainingPrograms: ["Empathetic Care Training", "Medical Protocols"],
      performanceGoals: [
        "Achieve 95% patient satisfaction",
        "Reduce wait times by 25%",
      ],
    },
  },
];

const sampleAgents = [
  {
    agentId: "AGENT001",
    name: "John Doe",
    companyId: new mongoose.Types.ObjectId(),
    totalCalls: 150,
    avgSentimentScore: 85,
    avgComplianceScore: 92,
    resolutionRate: 90,
    empathyScore: 88,
    clarityScore: 90,
    efficiencyScore: 87,
    performanceTrends: [
      {
        date: new Date("2023-01-01"),
        sentimentScore: 80,
        complianceScore: 90,
        resolutionRate: 85,
      },
      {
        date: new Date("2023-02-01"),
        sentimentScore: 85,
        complianceScore: 92,
        resolutionRate: 90,
      },
    ],
    score: 4.5,
    calls: 150,
    callDuration: 300,
    controls: [
      { type: "transfer", timestamp: new Date("2023-02-15T10:00:00") },
      { type: "hold", timestamp: new Date("2023-02-15T10:05:00") },
    ],
    isActive: true,
    agentInstructions: "Follow company protocols for customer interactions",
    compliance: 95,
    avgTime: 320,
  },
  {
    agentId: "AGENT002",
    name: "Jane Smith",
    companyId: new mongoose.Types.ObjectId(),
    totalCalls: 120,
    avgSentimentScore: 88,
    avgComplianceScore: 94,
    resolutionRate: 92,
    empathyScore: 90,
    clarityScore: 92,
    efficiencyScore: 89,
    performanceTrends: [
      {
        date: new Date("2023-01-01"),
        sentimentScore: 82,
        complianceScore: 89,
        resolutionRate: 87,
      },
      {
        date: new Date("2023-02-01"),
        sentimentScore: 88,
        complianceScore: 94,
        resolutionRate: 92,
      },
    ],
    score: 4.7,
    calls: 120,
    callDuration: 280,
    controls: [
      { type: "transfer", timestamp: new Date("2023-02-14T14:30:00") },
    ],
    isActive: true,
    agentInstructions: "Document all customer interactions thoroughly",
    compliance: 96,
    avgTime: 290,
  },
];

const sampleCalls = [
  {
    callId: "CALL1001",
    agentId: "AGENT001",
    customerId: "CUSTOMER001",
    startTime: new Date("2023-02-15T10:00:00"),
    endTime: new Date("2023-02-15T10:05:00"),
    duration: 300,
    transcript: "Customer calls to inquire about service status...",
    sentimentScore: 85,
    complianceScore: 92,
    resolutionStatus: "Resolved",
    metadata: {
      keywords: ["service", "status", "account"],
      topics: ["Account Management", "Service Inquiry"],
      responseTime: 45,
    },
    companyId: new mongoose.Types.ObjectId(),
  },
  {
    callId: "CALL1002",
    agentId: "AGENT002",
    customerId: "CUSTOMER002",
    startTime: new Date("2023-02-15T14:30:00"),
    endTime: new Date("2023-02-15T14:40:00"),
    duration: 600,
    transcript: "Customer has issue with billing...",
    sentimentScore: 78,
    complianceScore: 89,
    resolutionStatus: "In Progress",
    metadata: {
      keywords: ["billing", "charge", "dispute"],
      topics: ["Billing Issues", "Dispute Resolution"],
      responseTime: 60,
    },
    companyId: new mongoose.Types.ObjectId(),
  },
];

const sampleAlerts = [
  {
    alertId: "ALERT001",
    type: "Sentiment Drop",
    description: "Significant drop in sentiment detected in recent calls",
    severity: "High",
    status: "New",
    agentId: "AGENT001",
    callId: "CALL1001",
    companyId: new mongoose.Types.ObjectId(),
  },
  {
    alertId: "ALERT002",
    type: "Compliance Risk",
    description: "Potential compliance violation identified",
    severity: "Medium",
    status: "In Progress",
    agentId: "AGENT002",
    callId: "CALL1002",
    companyId: new mongoose.Types.ObjectId(),
  },
];

const sampleQueries = [
  {
    queryId: "QUERY001",
    queryText: "How to reset my password?",
    category: "Account Management",
    count: 45,
    trend: "up",
    sentiment: "neutral",
    lastUpdated: new Date(),
    companyId: new mongoose.Types.ObjectId(),
  },
  {
    queryId: "QUERY002",
    queryText: "Billing cycle explanation",
    category: "Billing",
    count: 30,
    trend: "stable",
    sentiment: "neutral",
    lastUpdated: new Date(),
    companyId: new mongoose.Types.ObjectId(),
  },
];

// Function to insert data
async function insertData() {
  try {
    // Insert companies
    const companies = await Company.insertMany(sampleCompanies);
    console.log(`Inserted ${companies.length} companies`);

    // Update agent companyIds to reference actual company IDs
    sampleAgents.forEach((agent) => {
      agent.companyId = companies[0]._id; // Assign first company ID
    });

    // Insert agents
    const agents = await Agent.insertMany(sampleAgents);
    console.log(`Inserted ${agents.length} agents`);

    // Update call companyIds and agentIds to reference actual IDs
    sampleCalls.forEach((call) => {
      call.companyId = companies[0]._id; // Assign first company ID
      call.agentId = agents.find((a) => a.agentId === call.agentId)?._id;
    });

    // Insert calls
    const calls = await Call.insertMany(sampleCalls);
    console.log(`Inserted ${calls.length} calls`);

    // Update alert companyIds, agentIds, and callIds to reference actual IDs
    sampleAlerts.forEach((alert) => {
      alert.companyId = companies[0]._id; // Assign first company ID
      alert.agentId = agents.find((a) => a.agentId === alert.agentId)?._id;
      alert.callId = calls.find((c) => c.callId === alert.callId)?._id;
    });

    // Insert alerts
    const alerts = await Alert.insertMany(sampleAlerts);
    console.log(`Inserted ${alerts.length} alerts`);

    // Update query companyIds to reference actual IDs
    sampleQueries.forEach((query) => {
      query.companyId = companies[0]._id; // Assign first company ID
    });

    // Insert queries
    const queries = await Query.insertMany(sampleQueries);
    console.log(`Inserted ${queries.length} queries`);

    console.log("Data insertion completed successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the insertion function
insertData();
