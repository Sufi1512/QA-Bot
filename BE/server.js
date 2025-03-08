const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/calls", require("./routes/callRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
