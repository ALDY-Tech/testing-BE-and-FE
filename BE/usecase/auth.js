// service.js
const argon2 = require("argon2");
const { insertUser, findUserByUsername } = require("../repository/auth.js");

// Register logic
const register = async ({ username, password }) => {
  const existing = await findUserByUsername(username);
  if (existing) throw new Error("User sudah terdaftar");

  const hashedPassword = await argon2.hash(password);
  const newUser = await insertUser({
    username: username,
    password: hashedPassword,
  });
  return newUser;
};

const login = async ({ username, password }) => {
  const foundUser = await findUserByUsername(username);
  if (!foundUser) throw new Error("User tidak ditemukan");

  const valid = await argon2.verify(foundUser.password, password);
  if (!valid) throw new Error("Password salah");

  return foundUser;
};


module.exports = {
  register,
  login,
};
