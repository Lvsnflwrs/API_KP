const conn = require("../config/DBHelper");
const bcrypt = require("bcrypt");

const getAdminbyEmail = (email) => {
    const QUERY = "SELECT id, username, password, email, role, created_at FROM admin WHERE email = ?";
    return conn.execute(QUERY, [email]);
}

const addAdmin = async (username, password, email, role) => {
    const QUERY = "INSERT INTO admin (username, password, email, role, created_at) VALUES (?, ?, ?, ?, NOW())";
    const salt = 10;
    const hashed = await bcrypt.hash(password, salt);
    return conn.execute(QUERY, [username, hashed, email, role]);
}

module.exports = {
    getAdminbyEmail,
    addAdmin,
}