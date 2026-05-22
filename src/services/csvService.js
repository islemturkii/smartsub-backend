function isValidTransaction(row) {
  return (
    row.date &&
    row.description &&
    row.amount &&
    !Number.isNaN(parseFloat(row.amount))
  );
}

module.exports = {
  isValidTransaction,
};