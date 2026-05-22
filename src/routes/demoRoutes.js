const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.delete("/reset", async (req, res) => {
  try {
    await pool.query("delete from subscription_transaction");
    await pool.query("delete from notification");
    await pool.query("delete from subscription");
    await pool.query("delete from transaction_record");
    await pool.query("delete from merchant");
    await pool.query("delete from data_import");

    res.json({
      message: "Demo data reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reset demo data",
      details: error.message,
    });
  }
});

module.exports = router;