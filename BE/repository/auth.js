const db = require("../config/config.js");

const insertUser = async (user) => {
  const newUser =await db.user.create({
    data: {
      username: user.username,
      password: user.password,
    }
  });
  return newUser;
};

const findUserByUsername = async (username) => {
  const loginUser = await db.user.findUnique({
    where: {
      username: username,
    },
  });
  return loginUser;
};

module.exports = {
  insertUser,
  findUserByUsername,
};
