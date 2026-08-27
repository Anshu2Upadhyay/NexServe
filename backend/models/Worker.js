const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        area: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            required: true
        },

        experience: {
            type: Number,
            default: 0,
            min: 0
        },

        isAvailable: {
            type: Boolean,
            default: false
        },

        location: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        },

        profileImage: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        completedJobs: {
            type: Number,
            default: 0
        },

        acceptedJobs: {
            type: Number,
            default: 0
        },

        role: {
            type: String,
            default: "worker",
            enum: ["worker"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Worker", workerSchema);