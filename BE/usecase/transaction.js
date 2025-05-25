import {
  insertTransaction,
  updateTransaction,
  allTransactionsbyUserId,
  deleteTransaction
} from "../repository/transaction.js";

// TODO: Implement the use case for insert transaction
const insertTransactionUseCase = async ({ userId, amount, description }) => {
  if (!userId || !amount || !description) {
    throw new Error("Semua field wajib diisi");
  }

  return await insertTransaction({ userId, amount, description });
};

// TODO: Implement the use case for update transaction
const updateTransactionUseCase = async (id, amount, description) => {
  if (!amount || !description) {
    throw new Error("Semua field harus diisi");
  }
  const updatedTransaction = await updateTransaction(id, amount, description);
  if (!updatedTransaction) {
    throw new Error("Transaksi tidak ditemukan");
  }
  
  return updatedTransaction;
};

// TODO: Implement the use case for get all transactions
const allTransactionsbyUserIDUseCase = async (userId) => {
  const transactions = await allTransactionsbyUserId(userId);
  if (transactions.length === 0) {
    throw new Error("Tidak ada transaksi yang ditemukan");
  }
  return transactions;
};

const deleteTransactionUseCase = async (id) => {
  const deletedTransaction = await deleteTransaction(id);
  if (!deletedTransaction) {
    throw new Error("Transaksi tidak ditemukan");
  }
  return deletedTransaction;
};

export {
  insertTransactionUseCase,
  updateTransactionUseCase,
  allTransactionsbyUserIDUseCase,
  deleteTransactionUseCase
};
