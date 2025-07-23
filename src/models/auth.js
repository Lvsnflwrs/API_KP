const conn = require("../config/DBHelper");
const bcrypt = require("bcrypt");

const getAdminbyEmail = (email) => {
    const QUERY = "SELECT id, username, password, email, role, created_at FROM admin WHERE email = ?";
    return conn.execute(QUERY, [email]);
};

const getAdminById = (id) => {
    const QUERY = "SELECT id, username, password, email, role, created_at FROM admin WHERE id = ?";
    return conn.execute(QUERY, [id]);
};

const addAdmin = async (username, password, email, role) => {
    const QUERY = "INSERT INTO admin (username, password, email, role, created_at) VALUES (?, ?, ?, ?, NOW())";
    const salt = 10;
    const hashed = await bcrypt.hash(password, salt);
    return conn.execute(QUERY, [username, hashed, email, role]);
};

const updateAdmin = async (id, updateData) => {
    let queryParts = [];
    let queryValues = [];
    for (const key in updateData) {
        queryParts.push(`${key} = ?`);
        queryValues.push(updateData[key]);
    }
    queryValues.push(id); // Add id for the WHERE clause
    
    const QUERY = `UPDATE admin SET ${queryParts.join(", ")} WHERE id = ?`;
    return conn.execute(QUERY, queryValues);
};

module.exports = {
    getAdminbyEmail,
    getAdminById, // Export the new function
    addAdmin,
    updateAdmin, // Export the new function
};