const {
  insertTransactionController,
  updateTransactionController,
  allTransactionsController,
} = require("../controller/transaction.js");

const express = require("express");
const router = express.Router();

router.post("/", insertTransactionController);
router.put("/:id", updateTransactionController);
router.get("/", allTransactionsController);

module.exports = router;