require("dotenv").config();
const modelAuth = require("../models/auth");
const faceController = require("../controller/facesController")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpAdmin = async (ws, msg) => {
    const { username, password, email, role } = msg;
    try {
        const [cekUser] = await modelAuth.getAdminbyEmail(email);
        if (cekUser.length > 0) {
            return ws.send(
                JSON.stringify({
                    type: "insert_admin",
                    success: false,
                    message: "admin sudah terdaftar",
                })
            )
        }
        await modelAuth.addAdmin(username, password, email, role);
        ws.send(
            JSON.stringify({
                type: "insert_admin",
                success: true,
                message: "Admin registered successfully"
            })
        );
    } catch (error) {
        console.log(error)
        ws.send(
            JSON.stringify({
                type: "insert_admin",
                success: false,
                message: error.message,
            })
        );
    }
};

const loginAdmin = async (ws, msg) => {
    const { email, password } = msg;
    try {
        const [found] = await modelAuth.getAdminbyEmail(email);

        if (found.length > 0) {
            const admin = found[0];
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
                    expiresIn: "5h",
                });
                return ws.send(
                    JSON.stringify({
                        type: "login",
                        success: true,
                        message: "login successful",
                        token,
                        adminId: admin.id
                    })
                )
            }
        }
        return ws.send(
            JSON.stringify({ 
                type: "login",
                success: false,
                message: "username or password is incorrect",
            })
        )
    } catch (error) {
        console.log(error);
        ws.send(
            JSON.stringify({
                type: "login",
                success: false,
                message: error.message,
            })
        );
    }
}

const loginAdminBiometric = async (ws, msg) => {
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
        const match = faceController.findNearest(userEmbedding, results);
        if (match && match.distance < 0.9) {
            const token = jwt.sign({ id: match.admin_id }, process.env.JWT_SECRET, {
                expiresIn: "5h",
            });
            
            return ws.send(
                console.log(match.admin_id),
                JSON.stringify({
                    type: "login",
                    success: true,
                    match: true,
                    message: "login successful",
                    token,
                    adminId: match.admin_id,
                })
            )
            
        }
        return ws.send(
            JSON.stringify({
                type: "login",
                success: false,
                match: false,
                message: "login gagal",
            })
        )
    } catch (error) {
        console.log(error);
        ws.send(
            JSON.stringify({
                type: "login",
                success: false,
                match: false,
                message: error.message,
            })
        );
    }
}

module.exports = {
    signUpAdmin,
    loginAdmin,
    loginAdminBiometric
}