const conn = require('../config/DBHelper');

const insertAttendance = async (userId, checkType, confidence, timestamp) => {
    const QUERY = "INSERT INTO attendance_logs (user_id, check_type, confidence, timestamp) VALUES (?, ?, ?, ?)";
    try {
        const [result] = await conn.execute(QUERY, [userId, checkType, confidence, timestamp]);
        return result;
    } catch (error) {
        console.error("DB insert error");
        throw error;
    }

};

module.exports = {
    insertAttendance
};
