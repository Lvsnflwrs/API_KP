const conn = require('../config/DBHelper');

const getUserFaceData = () => {
    const QUERY = `
        SELECT
            user_id,
            admin_id,
            name,
            email,
            phone,
            embeddings,
            role
        FROM users
    `;
    return conn.execute(QUERY);
}

const insertUsers = async (adminId, name, email, phone, embeddings, role) => {
    const QUERY = "INSERT INTO users (admin_id, name, email, phone, embeddings, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
    try {
        const [result] = await conn.execute(QUERY, [adminId, name, email, phone, embeddings, role]);
        return result;
    } catch (error) {
        console.error("DB Insert Error:", error);
        throw error;
    }
};

module.exports = {
    getUserFaceData,
    insertUsers
}