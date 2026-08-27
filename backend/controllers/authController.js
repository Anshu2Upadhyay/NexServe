const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Worker = require("../models/Worker");
const generateToken = require("../utils/generateToken");

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
            longitude
        } = req.body;

        if (!name || !email || !phone || !password || !city || !area) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or phone number is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            city,
            area,
            location: {
                latitude: latitude || null,
                longitude: longitude || null
            }
        });

        const token = generateToken(user._id, "customer");

        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                area: user.area,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Customer registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while registering customer"
        });
    }
};

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
            longitude
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
                message: "Please fill all required fields"
            });
        }

        const existingWorker = await Worker.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingWorker) {
            return res.status(409).json({
                success: false,
                message: "Email or phone number is already registered"
            });
        }

        const workerSkills = Array.isArray(skills)
            ? skills
            : skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter((skill) => skill.length > 0);

        if (workerSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one skill is required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const worker = await Worker.create({
            name,
            email,
            phone,
            password: hashedPassword,
            city,
            area,
            skills: workerSkills,
            experience: experience || 0,
            location: {
                latitude: latitude || null,
                longitude: longitude || null
            }
        });

        const token = generateToken(worker._id, "worker");

        res.status(201).json({
            success: true,
            message: "Worker registered successfully",
            token,
            worker: {
                id: worker._id,
                name: worker.name,
                email: worker.email,
                phone: worker.phone,
                city: worker.city,
                area: worker.area,
                skills: worker.skills,
                role: worker.role
            }
        });
    } catch (error) {
        console.error("Worker registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while registering worker"
        });
    }
};

const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id, "customer");

        res.status(200).json({
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
                role: user.role
            }
        });
    } catch (error) {
        console.error("Customer login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while logging in"
        });
    }
};

const loginWorker = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const worker = await Worker.findOne({
            email: email.toLowerCase()
        });

        if (!worker) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            worker.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(worker._id, "worker");

        res.status(200).json({
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
                role: worker.role
            }
        });
    } catch (error) {
        console.error("Worker login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while logging in"
        });
    }
};

module.exports = {
    registerCustomer,
    registerWorker,
    loginCustomer,
    loginWorker
};