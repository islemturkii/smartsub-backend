function normalizeMerchant(description) {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .split(" ")[0];
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function detectBillingCycle(transactions) {
  if (transactions.length < 2) return "unknown";

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  const intervals = [];

  for (let i = 1; i < sorted.length; i++) {
    intervals.push(
      daysBetween(sorted[i - 1].transaction_date, sorted[i].transaction_date)
    );
  }

  const avgInterval =
    intervals.reduce((sum, value) => sum + value, 0) / intervals.length;

  if (avgInterval >= 25 && avgInterval <= 35) return "monthly";
  if (avgInterval >= 6 && avgInterval <= 8) return "weekly";
  if (avgInterval >= 350 && avgInterval <= 380) return "yearly";

  return "unknown";
}

function estimateNextPayment(transactions, billingCycle) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  const lastDate = new Date(sorted[sorted.length - 1].transaction_date);

  if (billingCycle === "monthly") {
    lastDate.setMonth(lastDate.getMonth() + 1);
  } else if (billingCycle === "weekly") {
    lastDate.setDate(lastDate.getDate() + 7);
  } else if (billingCycle === "yearly") {
    lastDate.setFullYear(lastDate.getFullYear() + 1);
  } else {
    return null;
  }

  return lastDate.toISOString().split("T")[0];
}

module.exports = {
  normalizeMerchant,
  daysBetween,
  detectBillingCycle,
  estimateNextPayment,
};