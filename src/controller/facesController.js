const modelFace = require("../models/faces");

//HITUNG EUCLIDEAN DISTANCE
function calculateEuclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
}

// VERIFY FACE HANDLER
const verifyFaceHandler = async (ws, msg) => {
    const userEmbedding = msg.embedding;
    const [results] = await modelFace.getAllFaces();

    let bestMatch = null;
    let smallestDistance = Infinity;

    for (let row of results) {
        const dbEmbedding = row.embedding.split(",").map(Number);
        const distance = calculateEuclideanDistance(userEmbedding, dbEmbedding);
        if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = row.name;
        }
    }

    ws.send(
        JSON.stringify({
        type: "recognize_face",
        match: smallestDistance < 0.6,
        name: bestMatch,
        distance: smallestDistance,
        })
    );
};

// INSERT FACE HANDLER
const insertFaceHandler = async (ws, msg) => {
    try {
        const { name, embedding } = msg;
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