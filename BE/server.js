const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const agentRoutes = require("./routes/agentRoutes");
const callRoutes = require("./routes/callRoutes");
const queryRoutes = require("./routes/queryRoutes");
const topicRoutes = require("./routes/topicRoutes");
const issueRoutes = require("./routes/issueRoutes"); // Ensure this file exists
const sentimentRoutes = require("./routes/sentimentRoutes"); // Ensure this file exists

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());

// Add Content-Type middleware
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/calls", callRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/queries", queryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/sentiments", sentimentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

// Handle invalid JSON responses
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err);
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
