import  {
    insertTransactionUseCase,
    updateTransactionUseCase,
    allTransactionsbyUserIDUseCase,
    deleteTransactionUseCase
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

const allTransactionsByUserIDController = async (req, res) => {
  const userId = req.user.userId;
  try {
    const transactions = await allTransactionsbyUserIDUseCase(userId);

    const result = transactions.map((t) => ({
      id: t.id,
      username: t.user.username, // ubah dari userId ke username
      amount: t.amount,
      description: t.description,
      createdAt: t.createdAt,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

const updateTransactionController = async (req, res) => {
  const { id } = req.params;
  const {amount, description} = req.body;

  try {
    const updatedTransaction = await updateTransactionUseCase(parseInt(id), amount, description);
    if (!updatedTransaction) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }
    res.status(200).json({
      msg: "Transaksi berhasil diperbarui",
      transaction: {
        id: updatedTransaction.id,
        username: updatedTransaction.user.username,
        amount: updatedTransaction.amount,
        description: updatedTransaction.description,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const deleteTransactionController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await deleteTransactionUseCase(parseInt(id));
    res.status(200).json({
      msg: "Transaksi berhasil dihapus",
      transaction: {
        id: deletedTransaction.id,
        username: deletedTransaction.user.username,
        amount: deletedTransaction.amount,
        description: deletedTransaction.description,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export {
  insertTransactionController,
  updateTransactionController,
  allTransactionsByUserIDController,
  deleteTransactionController
};