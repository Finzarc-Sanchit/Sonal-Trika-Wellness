const bcrypt = require('bcryptjs');

async function matchPassword(enteredPassword, storedPassword) {
    if (!enteredPassword || !storedPassword) {
        return false;
    }

    return bcrypt.compare(enteredPassword, storedPassword);
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

module.exports = {
    matchPassword,
    hashPassword,
};
