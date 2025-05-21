const express = require("express");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan frontend kamu
    credentials: true,
  })
);
app.use(express.json());

// Setup session
app.use(
  session({
    secret: "your-secret-key", // ganti dengan string rahasia kamu
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // session valid 1 hari
    },
  })
);

// Gunakan routes
app.use("/", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
