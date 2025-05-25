import prisma from "../config/config.js";
const db = prisma;

const insertTransaction = async ({ userId, amount, description }) => {
  const newTransaction = await db.transaction.create({
    data: {
      userId,
      amount,
      description,
    },
    include: {
      user: true, // Include user data if needed
    },
  });

  return newTransaction;
};

const allTransactionsbyUserId = async (userId) => {
  const transactions = await db.transaction.findMany({
    where: { userId: userId },
  });
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

export {
  insertTransaction,
  allTransactionsbyUserId,
  updateTransaction,
};
