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

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SmartSub Backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-db", async (req, res) => {
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

app.use("/imports", importRoutes);
app.use("/transactions", transactionRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/notifications", notificationRoutes);
app.use("/summary", summaryRoutes);
app.use("/savings", savingsRoutes);
app.use("/demo", demoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SmartSub backend running on port ${PORT}`);
});