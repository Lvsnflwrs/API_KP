const conn = require('../config/DBHelper');

const getAllFaces = () => {
    const QUERY = "SELECT name, embedding FROM faces";
    return conn.execute(QUERY);
}


const insertFace = async (name, embedding) => {
    const QUERY = "INSERT INTO faces (name, embedding, created_at) VALUES (?, ?, NOW())";
    try {
        const [result] = await conn.execute(QUERY, [name, embedding]);
        console.log("Insert result:", result);
        return result;
    } catch (error) {
        console.error("DB Insert Error:", error);
        throw error;
    }
};
module.exports = {
    getAllFaces,
    insertFace
}