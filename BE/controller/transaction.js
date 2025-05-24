const {
    insertTransactionUseCase,
    updateTransactionUseCase,
    allTransactionsUseCase,
  } = require("../usecase/transaction.js");

const insertTransactionController = async (req, res) => {
  const transaction = req.body;

  try {
    const newTransaction = await insertTransactionUseCase(transaction);
    res.status(201).json({
      msg: "Transaksi berhasil ditambahkan",
      transaction: {
        id: newTransaction.id,
        userId: newTransaction.userId,
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

const allTransactionsController = async (req, res) => {
  try {
    const transactions = await allTransactionsUseCase();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  insertTransactionController,
  updateTransactionController,
  allTransactionsController,
};