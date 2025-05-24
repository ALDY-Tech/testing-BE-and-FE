const db = require("../config/config.js");

const insertTransaction = async (transaction) => {
  const newTransaction = await db.transaction.create({
    data: {
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description,
    },
  });
  return newTransaction;
};

const allTransactions = async () => {
  const transactions = await db.transaction.findMany();
  return transactions;
};

const updateTransaction = async (id, transaction) => {
  const updatedTransaction = await db.transaction.update({
    where: { id: id },
    data: {
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
    },
  });
  return updatedTransaction;
};

module.exports = { insertTransaction, allTransactions, updateTransaction };
