const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        // ==================================================
        // CUSTOMER
        // ==================================================

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==================================================
        // JOB DETAILS
        // ==================================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        requiredSkill: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: [
                "Easy",
                "Medium",
                "Hard"
            ],
            default: "Medium"
        },

        image: {
            type: String,
            default: ""
        },


        // ==================================================
        // LOCATION
        // ==================================================

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

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },


        // ==================================================
        // JOB PREFERENCES
        // ==================================================

        urgency: {
            type: String,
            enum: [
                "normal",
                "urgent"
            ],
            default: "normal"
        },

        bookingType: {
            type: String,
            enum: [
                "instant",
                "quote"
            ],
            required: true
        },


        // ==================================================
        // PRICE
        // ==================================================

        estimatedMinPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        estimatedMaxPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        finalPrice: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==================================================
        // ASSIGNED WORKER
        // ==================================================

        assignedWorker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worker",
            default: null
        },


        // ==================================================
        // OTP
        // ==================================================

        otp: {
            type: String,
            default: null
        },

        otpVerified: {
            type: Boolean,
            default: false
        },


        // ==================================================
        // PAYMENT
        // MINI PROJECT = FAKE / MOCK PAYMENT
        // ==================================================

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed"
            ],
            default: "pending"
        },

        paymentMethod: {
            type: String,
            enum: [
                "mock",
                "cash"
            ],
            default: "mock"
        },

        transactionId: {
            type: String,
            default: null,
            trim: true
        },

        paidAt: {
            type: Date,
            default: null
        },


        // ==================================================
        // RATING & REVIEW
        // ==================================================

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },

        review: {
            type: String,
            trim: true,
            default: null
        },

        ratedAt: {
            type: Date,
            default: null
        },


        // ==================================================
        // CANCELLATION
        // ==================================================

        cancellationReason: {
            type: String,
            trim: true,
            default: null
        },

        cancelledBy: {
            type: String,
            enum: [
                "customer",
                "worker",
                "system"
            ],
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        },


        // ==================================================
        // JOB STATUS
        // ==================================================

        status: {
            type: String,
            enum: [
                "posted",
                "searching",
                "accepted",
                "on_the_way",
                "otp_verified",
                "in_progress",
                "completed",
                "cancelled"
            ],
            default: "posted"
        }
    },

    {
        timestamps: true
    }
);


// ======================================================
// MODEL
// ======================================================

module.exports = mongoose.model(
    "Job",
    jobSchema
);