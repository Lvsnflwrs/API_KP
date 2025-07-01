const modelFace = require("../models/faces");

function calculateEuclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

// Find nearest embedding in DB
function findNearest(userEmbedding, dbEmbeddings) {
    let bestMatch = null;
    let smallestDistance = Infinity;

    for (let row of dbEmbeddings) {
        const knownEmbedding = row.embedding?.split(",").map(Number);
        if (!knownEmbedding || knownEmbedding.length !== userEmbedding.length) continue;

        const distance = calculateEuclideanDistance(userEmbedding, knownEmbedding);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            bestMatch = {
                name: row.name,
                distance
            };
        }
    }

    return bestMatch;
}

// VERIFY FACE HANDLER
const verifyFaceHandler = async (ws, msg) => {
    const userEmbedding = msg.embedding;
    console.log("Message received:", msg);
    console.log("Embedding:", msg.embedding);
    if (!userEmbedding || !Array.isArray(userEmbedding)) {
        ws.send(JSON.stringify({
            type: "error",
            message: "Invalid or missing 'embedding'"
        }));
        return;
    }

    try {
        const [results] = await modelFace.getAllFaces();
        const match = findNearest(userEmbedding, results);

        if (match) {
            ws.send(JSON.stringify({
                type: "recognize_face",
                match: match.distance < 0.9,
                name: match.name,
                distance: match.distance
            }));
        } else {
            ws.send(JSON.stringify({
                type: "recognize_face",
                match: false,
                name: null,
                distance: null
            }));
        }
    } catch (error) {
        console.error("Verify face error:", error);
        ws.send(JSON.stringify({
            type: "error",
            message: "Server error during recognition"
        }));
    }
};

// INSERT FACE HANDLER
const insertFaceHandler = async (ws, msg) => {
    try {
        const { name, embedding } = msg;
        console.log("Message received:", msg);
        console.log("Name:", msg.name);
        console.log("Embedding:", msg.embedding);
        if (!name || !embedding || !Array.isArray(embedding)) {
            return ws.send(JSON.stringify({
                type: "insert_face",
                success: false,
                message: "Invalid name or embedding format. 'embedding' must be an array."
            }));
        }

        const embeddingString = embedding.join(",");
        await modelFace.insertFace(name, embeddingString);

        ws.send(
            JSON.stringify({
                type: "insert_face",
                success: true,
            })
        );
    } catch (error) {
        console.error("Insert face error:", error);
        ws.send(
            JSON.stringify({
                type: "insert_face",
                success: false,
                message: error.message,
            })
        );
    }
};



module.exports = {
    verifyFaceHandler,
    insertFaceHandler
}