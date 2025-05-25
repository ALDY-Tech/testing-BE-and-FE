import {
  insertTransaction,
  updateTransaction,
  allTransactionsbyUserId
} from "../repository/transaction.js";

// TODO: Implement the use case for insert transaction
const insertTransactionUseCase = async ({ userId, amount, description }) => {
  if (!userId || !amount || !description) {
    throw new Error("Semua field wajib diisi");
  }

  return await insertTransaction({ userId, amount, description });
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
const allTransactionsbyUserIDUseCase = async (userId) => {
  const transactions = await allTransactionsbyUserId(userId);
  if (transactions.length === 0) {
    throw new Error("Tidak ada transaksi yang ditemukan");
  }
  return transactions;
};

export {
  insertTransactionUseCase,
  updateTransactionUseCase,
  allTransactionsbyUserIDUseCase,
};
