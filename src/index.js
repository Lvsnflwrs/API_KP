require("dotenv").config();

const { WebSocketServer } = require("ws");
const { webSocketHandler } = require("./controller/webSocketController");

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", webSocketHandler);

wss.on("close", () => {
    console.log("Client disconnected");
});

wss.on("error", (error) => {
    console.error("WebSocket error:", error);
});

console.log(`WebSocket Server running at ws://localhost:${PORT}`);
