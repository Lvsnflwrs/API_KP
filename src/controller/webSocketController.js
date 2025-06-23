const { verifyFaceHandler } = require('./facesController');
const { insertFaceHandler } = require('./facesController');

// WEB SOCKET HANDLER
const webSocketHandler = (ws) => {
    ws.on("message", async (data) => {
        try {
        const msg = JSON.parse(data);

        if (msg.type === "recognize_face") {
            await verifyFaceHandler(ws, msg);
        }

        if (msg.type === "insert_face") {
            await insertFaceHandler(ws, msg);
        }
        } catch (error) {
        console.error(error);
        ws.send(
            JSON.stringify({
            type: "error",
            message: error.message,
            })
        );
        }
    });
};

module.exports = {
    webSocketHandler
}