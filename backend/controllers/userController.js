const User = require("../models/User");


// ======================================================
// GET CUSTOMER PROFILE
// ======================================================

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching profile"
        });
    }
};


// ======================================================
// UPDATE CUSTOMER PROFILE
// ======================================================

const updateMyProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "phone",
            "city",
            "area"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body?.[field] !== undefined) {
                const value = String(req.body[field]).trim();

                if (!value) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} cannot be empty`
                    });
                }

                updates[field] = value;
            }
        }


        // --------------------------------------------------
        // PHONE VALIDATION
        // --------------------------------------------------

        if (
            updates.phone &&
            !/^[6-9]\d{9}$/.test(updates.phone)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10-digit Indian mobile number"
            });
        }


        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Provide at least one profile field to update"
            });
        }


        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: updates
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Phone number is already registered"
            });
        }

        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while updating profile"
        });
    }
};


// ======================================================
// UPDATE CUSTOMER GPS LOCATION
// ======================================================

const updateLocation = async (req, res) => {
    try {
        const latitude = Number(
            req.body?.latitude
        );

        const longitude = Number(
            req.body?.longitude
        );


        // --------------------------------------------------
        // VALIDATE GPS COORDINATES
        // --------------------------------------------------

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude must be valid numbers"
            });
        }


        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    "location.latitude": latitude,
                    "location.longitude": longitude
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            message:
                "Customer location updated successfully",

            location: user.location,

            user
        });

    } catch (error) {
        console.error(
            "Update customer location error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while updating location"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateLocation
};