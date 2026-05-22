const pool = require("../config/db");

const {
  normalizeMerchant,
  detectBillingCycle,
  estimateNextPayment,
} = require("../utils/merchantUtils");

async function detectSubscriptionsByImportId(importId) {
  const transactionsResult = await pool.query(
    `select *
     from transaction_record
     where data_import_id = $1
     order by transaction_date`,
    [importId]
  );

  const transactions = transactionsResult.rows;

  if (transactions.length === 0) {
    return {
      notFound: true,
      message: "No transactions found for this import",
    };
  }

  const grouped = {};

  for (const transaction of transactions) {
    const normalizedName = normalizeMerchant(transaction.description);

    if (!grouped[normalizedName]) {
      grouped[normalizedName] = [];
    }

    grouped[normalizedName].push(transaction);
  }

  const detectedSubscriptions = [];
  const skippedDuplicates = [];

  for (const normalizedName in grouped) {
    const group = grouped[normalizedName];

    if (group.length < 3) continue;

    const billingCycle = detectBillingCycle(group);

    if (billingCycle === "unknown") continue;

    const averageAmount =
      group.reduce((sum, t) => sum + parseFloat(t.amount), 0) / group.length;

    const userId = group[0].user_id;
    const nextPaymentDate = estimateNextPayment(group, billingCycle);

    const merchantResult = await pool.query(
      `insert into merchant (name, normalized_name)
       values ($1, $2)
       on conflict (normalized_name)
       do update set name = excluded.name, updated_at = now()
       returning id, name, normalized_name`,
      [group[0].description, normalizedName]
    );

    const merchant = merchantResult.rows[0];

    const existingSubscription = await pool.query(
      `select id
       from subscription
       where user_id = $1
         and merchant_id = $2
         and status = 'active'`,
      [userId, merchant.id]
    );

    if (existingSubscription.rows.length > 0) {
      skippedDuplicates.push({
        merchant: merchant.name,
        reason: "Subscription already exists",
      });
      continue;
    }

    const subscriptionResult = await pool.query(
      `insert into subscription
       (user_id, merchant_id, average_amount, billing_cycle, next_payment_date, confidence_score, status)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, average_amount, billing_cycle, next_payment_date, confidence_score, status`,
      [
        userId,
        merchant.id,
        averageAmount.toFixed(2),
        billingCycle,
        nextPaymentDate,
        0.9,
        "active",
      ]
    );

    const subscription = subscriptionResult.rows[0];

    for (const transaction of group) {
      await pool.query(
        `update transaction_record
         set merchant_id = $1, updated_at = now()
         where id = $2`,
        [merchant.id, transaction.id]
      );

      await pool.query(
        `insert into subscription_transaction (subscription_id, transaction_id)
         values ($1, $2)
         on conflict do nothing`,
        [subscription.id, transaction.id]
      );
    }

    detectedSubscriptions.push({
      merchant: merchant.name,
      normalized_name: merchant.normalized_name,
      subscription_id: subscription.id,
      average_amount: subscription.average_amount,
      billing_cycle: subscription.billing_cycle,
      next_payment_date: subscription.next_payment_date,
      confidence_score: subscription.confidence_score,
    });
  }

  return {
    notFound: false,
    detected_count: detectedSubscriptions.length,
    skipped_duplicates_count: skippedDuplicates.length,
    subscriptions: detectedSubscriptions,
    skipped_duplicates: skippedDuplicates,
  };
}

module.exports = {
  detectSubscriptionsByImportId,
};