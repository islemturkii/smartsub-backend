const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");
const { isValidTransaction } = require("./csvService");

async function getDemoUser() {
  const demoUserResult = await pool.query(
    "select id from app_user where email = $1",
    ["demo@smartsub.com"]
  );

  if (demoUserResult.rows.length === 0) {
    return null;
  }

  return demoUserResult.rows[0];
}

async function createImport(userId, fileName) {
  const importResult = await pool.query(
    `insert into data_import (user_id, file_name, status)
     values ($1, $2, $3)
     returning id, file_name, status, created_at`,
    [userId, fileName, "processing"]
  );

  return importResult.rows[0];
}

async function updateImportStatus(importId, status) {
  await pool.query(
    "update data_import set status = $1, updated_at = now() where id = $2",
    [status, importId]
  );
}

function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const invalidRows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (!isValidTransaction(row)) {
          invalidRows.push(row);
          return;
        }

        transactions.push({
          date: row.date,
          description: row.description,
          amount: parseFloat(row.amount),
        });
      })
      .on("end", () => {
        resolve({ transactions, invalidRows });
      })
      .on("error", reject);
  });
}

async function insertTransactions(userId, importId, transactions) {
  for (const t of transactions) {
    await pool.query(
      `insert into transaction_record
       (user_id, data_import_id, transaction_date, description, amount)
       values ($1, $2, $3, $4, $5)`,
      [userId, importId, t.date, t.description, t.amount]
    );
  }
}

async function processCsvImport(file) {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return {
      statusCode: 404,
      body: { error: "Demo user not found" },
    };
  }

  if (!file) {
    return {
      statusCode: 400,
      body: { error: "CSV file is required" },
    };
  }

  const userId = demoUser.id;
  const dataImport = await createImport(userId, file.originalname);
  const importId = dataImport.id;

  try {
    const { transactions, invalidRows } = await parseCsvFile(file.path);

    if (transactions.length === 0) {
      await updateImportStatus(importId, "failed");

      return {
        statusCode: 400,
        body: {
          error: "No valid transactions found in CSV",
          invalid_rows_count: invalidRows.length,
        },
      };
    }

    await insertTransactions(userId, importId, transactions);
    await updateImportStatus(importId, "completed");

    return {
      statusCode: 201,
      body: {
        message: "CSV processed successfully",
        import_id: importId,
        transactions_count: transactions.length,
        invalid_rows_count: invalidRows.length,
      },
    };
  } catch (error) {
    await updateImportStatus(importId, "failed");
    throw error;
  }
}

module.exports = {
  processCsvImport,
};