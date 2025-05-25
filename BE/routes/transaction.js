import {
  insertTransactionController,
  updateTransactionController,
  allTransactionsByUserIDController,
} from "../controller/transaction.js";
import {authenticateUser} from "../middleware/auth.js";

import express from "express";

const router = express.Router();

router.post("/", authenticateUser, insertTransactionController);
router.put("/:id", authenticateUser, updateTransactionController);
router.get("/", authenticateUser, allTransactionsByUserIDController);

export default router;