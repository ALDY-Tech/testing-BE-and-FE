import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transaction.js";
// Inisialisasi Express

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan frontend kamu
    credentials: true,
  })
);
app.use(express.json());

// Gunakan routes
app.use("/", authRoutes);
app.use("/transaction", transactionRoutes);
app.get("/hello", (req, res) => {
  res.json({
    message: "Welcome to the Expense Tracker API",
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
