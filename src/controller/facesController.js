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
        const knownEmbedding = row.embeddings?.split(",").map(Number);
        if (!knownEmbedding || knownEmbedding.length !== userEmbedding.length) continue;

        const distance = calculateEuclideanDistance(userEmbedding, knownEmbedding);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            bestMatch = {
                name: row.name,
                admin_id: row.admin_id,
                distance,
            };
        }
    }

    return bestMatch;
}

// VERIFY FACE HANDLER
const verifyFaceHandler = async (ws, msg) => {
    const userEmbedding = msg.embeddings;
    if (!userEmbedding || !Array.isArray(userEmbedding)) {
        ws.send(JSON.stringify({
            type: "error",
            message: "Invalid or missing 'embedding'"
        }));
        return;
    }

    try {
        const [results] = await modelFace.getUserFaceData();
        const match = findNearest(userEmbedding, results);

        if (match) {
            ws.send(JSON.stringify({
                type: "recognize_face",
                match: match.distance < 0.9,
                name: match.name,
                distance: match.distance,
                adminId: match.admin_id
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
        const { adminId, name, email, phone, embeddings, role } = msg;
        
        if (!adminId || !name || !email || !phone || !embeddings || !Array.isArray(embeddings)) {
            return ws.send(JSON.stringify({
                type: "insert_face",
                success: false,
                message: "Invalid input. Pastikan semua data termasuk adminId terisi dengan benar."
            }));
        }

        const embeddingString = embeddings.join(",");
        const finalRole = role || 'admin';
        await modelFace.insertUsers(adminId, name, email, phone, embeddingString, finalRole);

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
    insertFaceHandler,
    findNearest
}