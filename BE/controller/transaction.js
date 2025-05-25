import  {
    insertTransactionUseCase,
    updateTransactionUseCase,
    allTransactionsbyUserIDUseCase,
  } from "../usecase/transaction.js";

const insertTransactionController = async (req, res) => {
  const userId = req.user?.userId; // dari JWT payload
  const { amount, description } = req.body;

  try {
    const newTransaction = await insertTransactionUseCase({
      userId,
      amount,
      description,
    });

    res.status(201).json({
      msg: "Transaksi berhasil ditambahkan",
      transaction: {
        id: newTransaction.id,
        username: newTransaction.user.username,
        amount: newTransaction.amount,
        description: newTransaction.description,
        createdAt: newTransaction.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const updateTransactionController = async (req, res) => {
  const { id } = req.params;
  const transaction = req.body;

  try {
    const updatedTransaction = await updateTransactionUseCase(id, transaction);
    res.status(200).json({
      msg: "Transaksi berhasil diperbarui",
      transaction: {
        id: updatedTransaction.id,
        amount: updatedTransaction.amount,
        type: updatedTransaction.type,
        description: updatedTransaction.description,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const allTransactionsByUserIDController = async (req, res) => {
  const userId = req.user.userId;
  try {
    const transactions = await allTransactionsbyUserIDUseCase(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

export {
  insertTransactionController,
  updateTransactionController,
  allTransactionsByUserIDController,
};