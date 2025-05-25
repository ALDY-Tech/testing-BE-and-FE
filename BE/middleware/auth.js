// middleware/auth.js
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode("RAHASIA");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, secret);
    req.user = payload; // Pastikan token berisi userId
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
};

export { authenticateUser };
