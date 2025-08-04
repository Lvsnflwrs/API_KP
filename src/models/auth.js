const conn = require("../config/DBHelper");
const bcrypt = require("bcrypt");

const getAdminbyEmail = (email) => {
    const QUERY = "SELECT id, username, password, email, role, created_at FROM admins WHERE email = ?";
    return conn.execute(QUERY, [email]);
};

const getAdminById = (id) => {
    const QUERY = "SELECT id, username, password, email, role, created_at FROM admins WHERE id = ?";
    return conn.execute(QUERY, [id]);
};

const addAdmin = async (username, password, email, role) => {
    const QUERY = "INSERT INTO admins (username, password, email, role, created_at) VALUES (?, ?, ?, ?, NOW())";
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
    queryValues.push(id); 
    
    const QUERY = `UPDATE admins SET ${queryParts.join(", ")} WHERE id = ?`;
    return conn.execute(QUERY, queryValues);
};

module.exports = {
    getAdminbyEmail,
    getAdminById, 
    addAdmin,
    updateAdmin, 
};