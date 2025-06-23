const conn = require('../config/DBHelper');

const getAllFaces = () => {
    const QUERY = "SELECT name, embedding FROM faces";
    return conn.execute(QUERY);
}

const insertFace = (name, embedding) => {
    const QUERY = "INSERT INTO faces (name, embedding, created_at) VALUES (?, ?, NOW())";
    return conn.execute(QUERY, [
        name, embedding
    ]);
}
module.exports = {
    getAllFaces,
    insertFace
}