import { register, login } from "../usecase/auth.js";
import { generateToken } from "../utils/jwt.js";


const registerController = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password dan konfirmasi tidak cocok" });
  }

  try {
    const newUser = await register({ username, password });
    res.status(201).json({
      msg: "Registrasi berhasil",
      user: { user: newUser.username},
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const loggedUser = await login({ username, password });
    const token = await generateToken(loggedUser.id);

    res.status(200).json({
      msg: "Login berhasil",
      token: token,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const logoutController = (req, res) => {
  // Implementasi logout jika diperlukan
  res.status(200).json({ msg: "Logout berhasil" });
}

export {
  registerController,
  loginController,
  logoutController
};
