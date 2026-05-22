const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/monthly", async (req, res) => {
  try {
    const result = await pool.query(
      `select
        count(*)::int as subscription_count,
        coalesce(sum(
          case
            when billing_cycle = 'monthly' then average_amount
            when billing_cycle = 'weekly' then average_amount * 4
            when billing_cycle = 'yearly' then average_amount / 12
            else 0
          end
        ), 0)::numeric(10,2) as total_monthly_cost
       from subscription
       where status = 'active'`
    );

    res.json({
      month: new Date().toISOString().slice(0, 7),
      subscription_count: result.rows[0].subscription_count,
      total_monthly_cost: result.rows[0].total_monthly_cost,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch monthly summary",
      details: error.message,
    });
  }
});

module.exports = router;