const { register, login } = require("../usecase/auth.js");

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
    res.status(200).json({
      msg: "Login berhasil",
      user: { user: loggedUser.username },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  registerController,
  loginController,
};
