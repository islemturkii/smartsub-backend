const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { import_id } = req.query;

    let result;

    if (import_id) {
      result = await pool.query(
        `select *
         from transaction_record
         where data_import_id = $1
         order by transaction_date`,
        [import_id]
      );
    } else {
      result = await pool.query(
        `select *
         from transaction_record
         order by transaction_date`
      );
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch transactions",
      details: error.message,
    });
  }
});

module.exports = router;