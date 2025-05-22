// logic bisnis
// TODO : logic bisnis

const db = require('../config');

const insertUser = require('../repository');

const register = async (newUserData) => {
    const user = await insertUser(newUserData);
    return user;
}

const login = async (loginUser) => {
    const user = await insertUser(loginUser);
    return user;
}

module.exports = {
    register,
    login,
};