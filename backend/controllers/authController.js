const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Worker = require("../models/Worker");
const generateToken = require("../utils/generateToken");

// =====================================================
// HELPERS
// =====================================================

const normalizeEmail = (email) => {
    return String(email || "")
        .trim()
        .toLowerCase();
};

const normalizePhone = (phone) => {
    return String(phone || "")
        .trim();
};

const escapeRegex = (value) => {
    return String(value).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
};

// =====================================================
// CUSTOMER REGISTER
// =====================================================

const registerCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            city,
            area,
            latitude,
            longitude,
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !city ||
            !area
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields",
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);

        const existingUser =
            await User.findOne({
                $or: [
                    {
                        email: {
                            $regex: `^${escapeRegex(
                                normalizedEmail
                            )}$`,
                            $options: "i",
                        },
                    },
                    {
                        phone: normalizedPhone,
                    },
                ],
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or phone number is already registered",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
                password: hashedPassword,
                city: city.trim(),
                area: area.trim(),
                location: {
                    latitude:
                        latitude !== undefined &&
                        latitude !== null &&
                        latitude !== ""
                            ? Number(latitude)
                            : null,

                    longitude:
                        longitude !== undefined &&
                        longitude !== null &&
                        longitude !== ""
                            ? Number(longitude)
                            : null,
                },
            });

        const token =
            generateToken(
                user._id,
                "customer"
            );

        return res.status(201).json({
            success: true,
            message:
                "Customer registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                area: user.area,
                location: user.location,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(
            "Customer registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while registering customer",
        });
    }
};

// =====================================================
// WORKER REGISTER
// =====================================================

const registerWorker = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            city,
            area,
            skills,
            experience,
            latitude,
            longitude,
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !city ||
            !area ||
            !skills
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields",
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            normalizePhone(phone);

        const existingWorker =
            await Worker.findOne({
                $or: [
                    {
                        email: {
                            $regex: `^${escapeRegex(
                                normalizedEmail
                            )}$`,
                            $options: "i",
                        },
                    },
                    {
                        phone: normalizedPhone,
                    },
                ],
            });

        if (existingWorker) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or phone number is already registered",
            });
        }

        const workerSkills =
            Array.isArray(skills)
                ? skills
                      .map((skill) =>
                          String(skill).trim()
                      )
                      .filter(Boolean)
                : String(skills || "")
                      .split(",")
                      .map((skill) =>
                          skill.trim()
                      )
                      .filter(Boolean);

        if (workerSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one skill is required",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const worker =
            await Worker.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
                password: hashedPassword,
                city: city.trim(),
                area: area.trim(),
                skills: workerSkills,
                experience:
                    experience !== undefined &&
                    experience !== null &&
                    experience !== ""
                        ? Number(experience)
                        : 0,

                location: {
                    latitude:
                        latitude !== undefined &&
                        latitude !== null &&
                        latitude !== ""
                            ? Number(latitude)
                            : null,

                    longitude:
                        longitude !== undefined &&
                        longitude !== null &&
                        longitude !== ""
                            ? Number(longitude)
                            : null,
                },
            });

        const token =
            generateToken(
                worker._id,
                "worker"
            );

        return res.status(201).json({
            success: true,
            message:
                "Worker registered successfully",
            token,
            worker: {
                id: worker._id,
                name: worker.name,
                email: worker.email,
                phone: worker.phone,
                city: worker.city,
                area: worker.area,
                skills: worker.skills,
                experience: worker.experience,
                location: worker.location,
                isAvailable:
                    worker.isAvailable,
                role: worker.role,
            },
        });
    } catch (error) {
        console.error(
            "Worker registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while registering worker",
        });
    }
};

// =====================================================
// CUSTOMER LOGIN
// =====================================================

const loginCustomer = async (req, res) => {
    try {
        const { email, password } =
            req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        const user =
            await User.findOne({
                email: {
                    $regex: `^${escapeRegex(
                        normalizedEmail
                    )}$`,
                    $options: "i",
                },
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const token =
            generateToken(
                user._id,
                "customer"
            );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                area: user.area,
                location: user.location,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(
            "Customer login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while logging in",
        });
    }
};

// =====================================================
// WORKER LOGIN
// =====================================================

const loginWorker = async (req, res) => {
    try {
        const { email, password } =
            req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        const worker =
            await Worker.findOne({
                email: {
                    $regex: `^${escapeRegex(
                        normalizedEmail
                    )}$`,
                    $options: "i",
                },
            });

        if (!worker) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                worker.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const token =
            generateToken(
                worker._id,
                "worker"
            );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            worker: {
                id: worker._id,
                name: worker.name,
                email: worker.email,
                phone: worker.phone,
                city: worker.city,
                area: worker.area,
                skills: worker.skills,
                experience:
                    worker.experience,
                location:
                    worker.location,
                isAvailable:
                    worker.isAvailable,
                role: worker.role,
            },
        });
    } catch (error) {
        console.error(
            "Worker login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while logging in",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    registerCustomer,
    registerWorker,
    loginCustomer,
    loginWorker,
};