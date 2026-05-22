const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `select 
        s.id as subscription_id,
        m.name as merchant,
        s.average_amount,
        s.next_payment_date,
        case
          when s.next_payment_date is null then 'No upcoming payment date available'
          else m.name || ' payment of €' || s.average_amount || ' is coming on ' || s.next_payment_date
        end as message
       from subscription s
       join merchant m on s.merchant_id = m.id
       where s.status = 'active'
       order by s.next_payment_date`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch notifications",
      details: error.message,
    });
  }
});

module.exports = router;