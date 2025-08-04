const conn = require('../config/DBHelper');

const getUserFaceData = () => {
    const QUERY = "SELECT name, embeddings FROM users";
    return conn.execute(QUERY);
}

const insertUsers = async (name, email, phone, embeddings) => {
    const QUERY = "INSERT INTO users (name, email, phone, embeddings, created_at) VALUES (?, ?, ?, ?, NOW())";
    try {
        const [result] = await conn.execute(QUERY, [name, email, phone, embeddings]);
        console.log("Insert result:", result);
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