const User = require("../models/User");

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching profile"
        });
    }
};

module.exports = {
    getMyProfile
};