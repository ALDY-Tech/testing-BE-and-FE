import {
  insertTransactionController,
  updateTransactionController,
  allTransactionsByUserIDController,
  deleteTransactionController,
} from "../controller/transaction.js";
import {authenticateUser} from "../middleware/auth.js";

import express from "express";

const router = express.Router();

router.post("/", authenticateUser, insertTransactionController);
router.get("/", authenticateUser, allTransactionsByUserIDController);
router.patch("/:id", authenticateUser, updateTransactionController);
router.delete("/:id", authenticateUser, deleteTransactionController);


export default router;