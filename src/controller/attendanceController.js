const modelAttendance = require("../models/attendance");

const insertAttendanceLog = async (ws, msg) => {
    const { user_id, check_type, confidence, timestamp } = msg;

    try {
        await modelAttendance.insertAttendance(user_id, check_type, confidence, timestamp);

        ws.send(JSON.stringify({
            type: "INSERT_ATTENDANCE",
            success: true,
            message: "Attendance logged successfully"
        }));
    } catch (error) {
        console.error(error);
        ws.send(JSON.stringify({
            type: "INSERT_ATTENDANCE",
            success: false,
            message: error.message
        }));
    }
};

module.exports = {
    insertAttendanceLog
};