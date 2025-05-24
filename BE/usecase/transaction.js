const {insertTransaction, allTransactions, updateTransaction} = require("../repository/transaction.js");

// TODO: Implement the use case for insert transaction
const insertTransactionUseCase = async (transaction) => {
  if (!transaction.userId &&!transaction.amount && !transaction.description) {
    throw new Error("Semua field harus diisi");
  }
  const newTransaction = await insertTransaction(transaction);
  return newTransaction;
};

// TODO: Implement the use case for update transaction
const updateTransactionUseCase = async (id, transaction) => {
  if (!transaction.amount || !transaction.type || !transaction.description) {
    throw new Error("Semua field harus diisi");
  }
  const updatedTransaction = await updateTransaction(id, transaction);
  return updatedTransaction;
};

// TODO: Implement the use case for get all transactions
const allTransactionsUseCase = async () => {
  const transactions = await allTransactions();
  if (transactions.length === 0) {
    throw new Error("Tidak ada transaksi yang ditemukan");
  }
  return transactions;
}

module.exports = {
  insertTransactionUseCase,
  updateTransactionUseCase,
  allTransactionsUseCase,
};