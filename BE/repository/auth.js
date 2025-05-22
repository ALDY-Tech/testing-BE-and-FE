// atur database seperti masuk ke mana
/**
 *  * Important: This file is a placeholder for the authentication repository.
 *  ! error: This file should not be used in production.
 * ? what : This file is a placeholder for the authentication repository.
 * ? why : This file is a placeholder for the authentication repository.
 * TODO : This file should be replaced with the actual authentication repository.
 * @param {string} email - The email address of the user.
 */

const db = require("../config");

const insertUser = async (userData) => {
    const user = await db.users.create({
        data : {
            email: userData.email,
            password: userData.password,
        },
    });
    return user;
}

module.exports = insertUser;

