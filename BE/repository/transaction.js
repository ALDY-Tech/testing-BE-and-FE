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
    include: {
      user: true,
    }
  });
  return transactions;
};


const updateTransaction = async (id, amount, description) => {
  const updatedTransaction = await db.transaction.update({
    where: { id: id },
    data: {
      amount: amount,
      description: description,
    },
    include: {
      user: true, // Include user data if needed
    },
  });
  return updatedTransaction;
};

const deleteTransaction = async (id) => {
  const deletedTransaction = await db.transaction.delete({
    where: { id: id },
    include: {
      user: true, // Include user data if needed
    }
  });

  return deletedTransaction;
};

export {
  insertTransaction,
  allTransactionsbyUserId,
  updateTransaction,
  deleteTransaction,
};
