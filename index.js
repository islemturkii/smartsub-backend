require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./src/config/db");

const importRoutes = require("./src/routes/importRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const summaryRoutes = require("./src/routes/summaryRoutes");
const savingsRoutes = require("./src/routes/savingsRoutes");
const demoRoutes = require("./src/routes/demoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SmartSub API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SmartSub Backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("select * from app_user");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

app.use("/api/imports", importRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/demo", demoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SmartSub backend running on port ${PORT}`);
});