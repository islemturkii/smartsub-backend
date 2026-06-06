const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const MONTHLY_COST_THRESHOLD = 15;
const LOW_CONFIDENCE_THRESHOLD = 0.75;

function toMonthlyCost(amount, cycle) {
  const amt = parseFloat(amount);
  switch (cycle) {
    case "weekly": return amt * 4;
    case "yearly": return amt / 12;
    default: return amt;
  }
}

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
        s.confidence_score
       from subscription s
       join merchant m on s.merchant_id = m.id
       where s.status = 'active'`
    );

    const subscriptions = result.rows;

    // Count normalized merchant occurrences for duplicate detection
    const merchantCounts = {};
    for (const sub of subscriptions) {
      merchantCounts[sub.normalized_name] = (merchantCounts[sub.normalized_name] || 0) + 1;
    }

    const flagged = [];

    for (const sub of subscriptions) {
      const monthlyCost = toMonthlyCost(sub.average_amount, sub.billing_cycle);
      const reasons = [];

      if (monthlyCost >= MONTHLY_COST_THRESHOLD) {
        reasons.push("High monthly cost");
      }
      if (merchantCounts[sub.normalized_name] > 1) {
        reasons.push("Duplicate recurring service");
      }
      if (sub.confidence_score < LOW_CONFIDENCE_THRESHOLD) {
        reasons.push("Low detection confidence, review recommended");
      }

      if (reasons.length > 0) {
        flagged.push({
          subscription_id: sub.id,
          merchant: sub.merchant,
          amount: parseFloat(sub.average_amount),
          billing_cycle: sub.billing_cycle,
          monthly_equivalent_cost: parseFloat(monthlyCost.toFixed(2)),
          next_payment_date: sub.next_payment_date,
          savings_reason: reasons.join("; "),
          estimated_monthly_savings: parseFloat(monthlyCost.toFixed(2)),
        });
      }
    }

    const totalSavings = flagged.reduce((sum, f) => sum + f.estimated_monthly_savings, 0);

    res.json({
      total_potential_monthly_savings: parseFloat(totalSavings.toFixed(2)),
      flagged_count: flagged.length,
      flagged_subscriptions: flagged,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to compute savings",
      details: error.message,
    });
  }
});

module.exports = router;
