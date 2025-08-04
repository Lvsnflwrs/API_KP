require("dotenv").config();
const modelAuth = require ("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpAdmin = async (ws, msg) => {
    const {username, password, email, role} = msg;
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
    console.log("loginAdmin function called for email:", msg.email);
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
            console.log("Sending successful login response to client.");
            ws.send(JSON.stringify({
                type: "login",
                success: true,
                message: "login successful",
                token,
                data: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                }
            }));
            return;
        }
    
        console.log("Sending incorrect credentials response to client.");
        }
        return ws.send(
            JSON.stringify({
                type: "login",
                success: false,
                message: "username or password is incorrect",
            })
        )
    } catch (error) {
        console.log("Error in loginAdmin:", error);
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

module.exports = {
    signUpAdmin,
    loginAdmin,
}