const express = require("express");
const pool = require("../config/db");
const {
  detectSubscriptionsByImportId,
} = require("../services/subscriptionDetectionService");

const router = express.Router();

router.post("/detect/:import_id", async (req, res) => {
  try {
    const result = await detectSubscriptionsByImportId(req.params.import_id);

    if (result.notFound) {
      return res.status(404).json({ error: result.message });
    }

    res.json({
      message: "Subscription detection completed",
      detected_count: result.detected_count,
      skipped_duplicates_count: result.skipped_duplicates_count,
      subscriptions: result.subscriptions,
      skipped_duplicates: result.skipped_duplicates,
    });
  } catch (error) {
    res.status(500).json({
      error: "Subscription detection failed",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `select 
        s.id,
        m.name as merchant,
        m.normalized_name,
        s.average_amount,
        s.billing_cycle,
        s.next_payment_date,
        s.confidence_score,
        s.status,
        s.created_at
       from subscription s
       join merchant m on s.merchant_id = m.id
       order by s.next_payment_date`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch subscriptions",
      details: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subscriptionResult = await pool.query(
      `select 
        s.id,
        m.name as merchant,
        m.normalized_name,
        s.average_amount,
        s.billing_cycle,
        s.next_payment_date,
        s.confidence_score,
        s.status,
        s.created_at
       from subscription s
       join merchant m on s.merchant_id = m.id
       where s.id = $1`,
      [id]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const transactionsResult = await pool.query(
      `select tr.*
       from transaction_record tr
       join subscription_transaction st 
       on tr.id = st.transaction_id
       where st.subscription_id = $1
       order by tr.transaction_date`,
      [id]
    );

    res.json({
      subscription: subscriptionResult.rows[0],
      transactions: transactionsResult.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch subscription details",
      details: error.message,
    });
  }
});

module.exports = router;