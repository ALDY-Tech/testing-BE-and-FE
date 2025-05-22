const supabase  = require("../config/config.js");
const argon2 = require("argon2");

const Register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password dan konfirmasi tidak cocok" });
  }

  try {
    // Cek apakah username sudah terdaftar
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (checkError) return res.status(500).json({ msg: checkError.message });
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Username sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Insert user
    const { error } = await supabase.from("users").insert([
      {
        username,
        password: hashedPassword,
      },
    ]);

    if (error) return res.status(500).json({ msg: error.message });

    res.status(201).json({ msg: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .limit(1);

  if (error) return res.status(500).json({ msg: error.message });
  if (!users || users.length === 0) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }

  const user = users[0];
  const match = await argon2.verify(user.password, password);
  if (!match) return res.status(400).json({ msg: "Password salah" });

  req.session.userId = user.id;
  res
    .status(200)
    .json({ msg: "Login berhasil", id: user.id, username: user.username });
};

module.exports = {
  Register,
  Login,
};
