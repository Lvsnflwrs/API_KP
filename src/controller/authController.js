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
                    data: { // Menambahkan objek data untuk detail admin
                        id: admin.id,
                        username: admin.username,
                        email: admin.email, 
                        role: admin.role 
                    }
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

module.exports = {
    signUpAdmin,
    loginAdmin,
}