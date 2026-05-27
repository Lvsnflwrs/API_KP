require("dotenv").config();

const fs = require("fs"); 
const https = require("https"); 
const { WebSocketServer } = require("ws");
const { webSocketHandler } = require("./controller/webSocketController");

const PORT = process.env.PORT || 3000;

const serverConfig = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
};

const httpsServer = https.createServer(serverConfig);

const wss = new WebSocketServer({ server: httpsServer });

wss.on("connection", webSocketHandler);

wss.on("close", () => {
    console.log("Client disconnected");
});

wss.on("error", (error) => {
    console.error("WebSocket error:", error);
});

httpsServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Secure WebSocket Server running at wss://0.0.0.0:${PORT}`);
});