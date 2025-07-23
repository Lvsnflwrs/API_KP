const modelAuth = require("../models/auth"); // Using modelAuth for admin operations
const bcrypt = require("bcrypt"); // For password hashing if you decide to allow password updates

const getAdminProfile = async (ws, msg) => {
    const { adminId } = msg;
    try {
        const [foundAdmin] = await modelAuth.getAdminById(adminId); // You'll need to implement getAdminById in modelAuth
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
                    // Pastikan hanya field ini yang dikirim. Jangan sertakan password atau created_at di sini.
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
    const { adminId, username, email, password } = msg; // Include password if you want to allow updating it
    try {
        let updateData = { username, email };
        if (password) {
            const salt = 10;
            updateData.password = await bcrypt.hash(password, salt);
        }

        const [result] = await modelAuth.updateAdmin(adminId, updateData); // Implement updateAdmin in modelAuth

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