const conn = require("../config/DBHelper");
const bcrypt = require("bcrypt");

const getAdminbyUsername = (username) => {
    const QUERY = "SELECT * FROM admin WHERE username = ?";
    return conn.execute(QUERY, [username]);
}

const addAdmin = async (username, password) => {
    const QUERY = "INSERT  INTO admin (username, password, created_at) VALUES (?, ?, NOW())";
    const salt = 10;
    const hashed = await bcrypt.hash(password, salt);
    return conn.execute(QUERY, [username, hashed])
}

module.exports = {
    getAdminbyUsername,
    addAdmin,
}