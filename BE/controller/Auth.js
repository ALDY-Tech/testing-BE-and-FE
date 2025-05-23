const { register, login } = require("../usecase/auth.js");

const registerController = async (req, res) => {
  const { user, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password dan konfirmasi tidak cocok" });
  }

  try {
    const newUser = await register({ user, password });
    res.status(201).json({
      msg: "Registrasi berhasil",
      user: { user: newUser.user },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
    console.log(err);
  }
};

const loginController = async (req, res) => {
  const { user, password } = req.body;

  try {
    const loggedUser = await login({ user, password });
    res.status(200).json({
      msg: "Login berhasil",
      user: { user: loggedUser.user },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
    console.log(err);
  }
};

module.exports = {
  registerController,
  loginController,
};
