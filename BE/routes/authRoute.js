const express = require("express");
const { Register, Login } = require("../controller/Auth.js");

const router = express.Router();

// Route untuk registrasi
router.post("/register", Register);

// Route untuk login
router.post("/login", Login);

// Route untuk logout (opsional)
// router.delete("/logout", logOut);

// Route untuk cek user login (opsional)
// router.get("/me", Me);

module.exports = router;
