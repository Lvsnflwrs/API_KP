const { verifyFaceHandler } = require('./facesController');
const { insertFaceHandler } = require('./facesController');
const { signUpAdmin } = require ('./authController');
const { loginAdmin } = require ('./authController');

// WEB SOCKET HANDLER
const webSocketHandler = (ws) => {
    ws.on("message", async (data) => {
        console.log("Received message from client:", data.toString());
        try {
        const msg = JSON.parse(data);

        if (msg.type === "recognize_face") {
            await verifyFaceHandler(ws, msg);
        }

        if (msg.type === "insert_face") {
            await insertFaceHandler(ws, msg);
        }

        if (msg.type === "insert_admin") {
            await signUpAdmin(ws, msg);
        }

        if (msg.type === "LOGIN_REQUEST") {
            await loginAdmin(ws, msg);
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