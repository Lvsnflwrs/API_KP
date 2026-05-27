const modelAuth = require("../models/auth"); 
const bcrypt = require("bcrypt");

const getAdminProfile = async (ws, msg) => {
    const { adminId } = msg;
    try {
        const [foundAdmin] = await modelAuth.getAdminById(adminId); 
        if (foundAdmin.length > 0) {
        const admin = foundAdmin[0];
        return ws.send(
            JSON.stringify({
                type: "profile_data",
                success: true,
                message: "Profile data retrieved successfully",
                data: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                },
            })
        );
    } else {
            return ws.send(
                JSON.stringify({
                    type: "profile_data",
                    success: false,
                    message: "Admin not found",
                })
            );
        }
    } catch (error) {
        console.error("Error in getAdminProfile:", error);
        ws.send(
            JSON.stringify({
                type: "profile_data",
                success: false,
                message: error.message,
            })
        );
    }
};

const updateAdminProfile = async (ws, msg) => {
    const { adminId, username, email, password } = msg; 
    try {
        let updateData = { username, email };
        if (password) {
            const salt = 10;
            updateData.password = await bcrypt.hash(password, salt);
        }

        const [result] = await modelAuth.updateAdmin(adminId, updateData); 

        if (result.affectedRows > 0) {
            return ws.send(
                JSON.stringify({
                    type: "profile_update",
                    success: true,
                    message: "Profile updated successfully",
                })
            );
        } else {
            return ws.send(
                JSON.stringify({
                    type: "profile_update",
                    success: false,
                    message: "Failed to update profile or admin not found",
                })
            );
        }
    } catch (error) {
        console.error("Error in updateAdminProfile:", error);
        ws.send(
            JSON.stringify({
                type: "profile_update",
                success: false,
                message: error.message,
            })
        );
    }
};

module.exports = {
    getAdminProfile,
    updateAdminProfile,
};