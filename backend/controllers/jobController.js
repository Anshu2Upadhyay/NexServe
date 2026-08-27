const mongoose = require("mongoose");

const Job = require("../models/Job");
const Worker = require("../models/Worker");

const {
    calculateDistance
} = require("../services/locationService");

const {
    predictJobDetails
} = require("../services/aiService");

const {
    calculateEstimatedPrice
} = require("../services/priceService");

const generateOTP = require("../utils/generateOTP");

const {
    createNotification
} = require("../services/notificationService");


// ======================================================
// SAFE NOTIFICATION HELPER
// Notification fail hone par main job operation fail nahi hoga
// ======================================================

const notify = async ({
    recipient,
    recipientRole,
    type,
    title,
    message,
    job = null
}) => {
    try {
        if (!recipient) {
            return;
        }

        await createNotification({
            recipient,
            recipientRole,
            type,
            title,
            message,
            job
        });

    } catch (error) {
        console.error(
            "Notification error:",
            error.message
        );
    }
};


// ======================================================
// CREATE JOB
// ======================================================

const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            requiredSkill,
            image,
            city,
            area,
            latitude,
            longitude,
            urgency,
            bookingType
        } = req.body || {};

        if (
            !title ||
            !description ||
            !city ||
            !area ||
            latitude === undefined ||
            longitude === undefined ||
            !bookingType
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required job details"
            });
        }

        if (
            !["instant", "quote"].includes(
                bookingType
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking type"
            });
        }

        if (
            urgency &&
            !["normal", "urgent"].includes(
                urgency
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid urgency type"
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude must be numbers"
            });
        }


        // ==================================================
        // AI CLASSIFICATION
        // ==================================================

        let aiPrediction = null;

        try {
            aiPrediction =
                await predictJobDetails(
                    description
                );
        } catch (error) {
            console.error(
                "AI prediction error:",
                error.message
            );
        }


        const finalCategory =
            aiPrediction?.category ||
            category ||
            "Other";

        const finalRequiredSkill =
            aiPrediction?.requiredSkill ||
            requiredSkill ||
            "General Worker";

        const finalDifficulty =
            aiPrediction?.difficulty ||
            "Medium";


        // ==================================================
        // PRICE ESTIMATION
        // ==================================================

        let priceEstimate = {
            minPrice: 0,
            maxPrice: 0
        };

        try {
            priceEstimate =
                calculateEstimatedPrice({
                    category:
                        finalCategory,

                    difficulty:
                        finalDifficulty,

                    urgency:
                        urgency || "normal"
                });
        } catch (error) {
            console.error(
                "Price estimation error:",
                error.message
            );
        }


        // ==================================================
        // CREATE JOB
        // ==================================================

        const job = await Job.create({
            customer: req.user.id,

            title,

            description,

            category:
                finalCategory,

            requiredSkill:
                finalRequiredSkill,

            difficulty:
                finalDifficulty,

            image:
                image || "",

            city,

            area,

            location: {
                latitude: lat,
                longitude: lng
            },

            urgency:
                urgency || "normal",

            bookingType,

            estimatedMinPrice:
                priceEstimate.minPrice || 0,

            estimatedMaxPrice:
                priceEstimate.maxPrice || 0,

            finalPrice: 0,

            paymentStatus:
                "pending",

            paymentMethod:
                "mock",

            transactionId:
                null,

            paidAt:
                null,

            status:
                "posted"
        });


        // Customer notification
        await notify({
            recipient:
                req.user.id,

            recipientRole:
                "customer",

            type:
                "job_created",

            title:
                "Job Posted",

            message:
                `Your job "${job.title}" has been posted successfully.`,

            job:
                job._id
        });


        res.status(201).json({
            success: true,

            message:
                "Job posted successfully",

            aiPrediction: {
                category:
                    finalCategory,

                requiredSkill:
                    finalRequiredSkill,

                difficulty:
                    finalDifficulty
            },

            estimatedPrice: {
                min:
                    priceEstimate.minPrice || 0,

                max:
                    priceEstimate.maxPrice || 0
            },

            job
        });

    } catch (error) {
        console.error(
            "Create job error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while creating job"
        });
    }
};


// ======================================================
// GET CUSTOMER JOBS
// ======================================================

const getMyJobs = async (req, res) => {
    try {
        const jobs =
            await Job.find({
                customer:
                    req.user.id
            })
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            count:
                jobs.length,
            jobs
        });

    } catch (error) {
        console.error(
            "Get customer jobs error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching jobs"
        });
    }
};


// ======================================================
// GET SINGLE JOB
// ======================================================

const getJobDetails = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                customer:
                    req.user.id
            })
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                )
                .populate(
                    "customer",
                    "name phone city area"
                );

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error(
            "Get job details error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching job details"
        });
    }
};


// ======================================================
// GET AVAILABLE JOBS
// ======================================================

const getAvailableJobs = async (req, res) => {
    try {
        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        if (!worker.isAvailable) {
            return res.status(200).json({
                success: true,
                count: 0,
                radius: 5,
                message:
                    "You are currently offline",
                jobs: []
            });
        }

        if (
            worker.location?.latitude ===
                null ||
            worker.location?.longitude ===
                null ||
            worker.location?.latitude ===
                undefined ||
            worker.location?.longitude ===
                undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please update your location first"
            });
        }


        const jobs =
            await Job.find({
                city:
                    worker.city,

                requiredSkill: {
                    $in:
                        worker.skills
                },

                status: {
                    $in: [
                        "posted",
                        "searching"
                    ]
                },

                assignedWorker:
                    null
            })
                .populate(
                    "customer",
                    "name phone city area"
                )
                .sort({
                    createdAt: -1
                });


        const nearbyJobs =
            jobs
                .map((job) => {

                    const distance =
                        calculateDistance(
                            worker.location.latitude,
                            worker.location.longitude,
                            job.location.latitude,
                            job.location.longitude
                        );

                    return {
                        ...job.toObject(),

                        distance:
                            Number(
                                distance.toFixed(2)
                            )
                    };
                })
                .filter(
                    (job) =>
                        job.distance <= 5
                )
                .sort(
                    (a, b) =>
                        a.distance -
                        b.distance
                );


        res.status(200).json({
            success: true,
            count:
                nearbyJobs.length,
            radius: 5,
            jobs:
                nearbyJobs
        });

    } catch (error) {
        console.error(
            "Get available jobs error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching available jobs"
        });
    }
};


// ======================================================
// ACCEPT JOB
// ======================================================

const acceptJob = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        if (!worker.isAvailable) {
            return res.status(400).json({
                success: false,
                message:
                    "You are currently offline"
            });
        }

        if (
            worker.location?.latitude ===
                null ||
            worker.location?.longitude ===
                null ||
            worker.location?.latitude ===
                undefined ||
            worker.location?.longitude ===
                undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please update your location first"
            });
        }

        const job =
            await Job.findById(
                jobId
            );

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }

        if (job.assignedWorker) {
            return res.status(409).json({
                success: false,
                message:
                    "This job has already been accepted by another worker"
            });
        }

        if (
            ![
                "posted",
                "searching"
            ].includes(
                job.status
            )
        ) {
            return res.status(409).json({
                success: false,
                message:
                    `This job cannot be accepted because its current status is ${job.status}`
            });
        }

        if (
            job.city
                .trim()
                .toLowerCase() !==
            worker.city
                .trim()
                .toLowerCase()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "This job is outside your city"
            });
        }


        const hasRequiredSkill =
            worker.skills.some(
                (skill) =>
                    skill
                        .trim()
                        .toLowerCase() ===
                    job.requiredSkill
                        .trim()
                        .toLowerCase()
            );

        if (!hasRequiredSkill) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have the required skill for this job"
            });
        }


        const distance =
            calculateDistance(
                worker.location.latitude,
                worker.location.longitude,
                job.location.latitude,
                job.location.longitude
            );

        if (distance > 5) {
            return res.status(403).json({
                success: false,
                message:
                    "This job is outside your service radius"
            });
        }


        const updatedJob =
            await Job.findOneAndUpdate(
                {
                    _id:
                        jobId,

                    assignedWorker:
                        null,

                    status: {
                        $in: [
                            "posted",
                            "searching"
                        ]
                    }
                },

                {
                    $set: {
                        assignedWorker:
                            worker._id,

                        status:
                            "accepted"
                    }
                },

                {
                    new:
                        true
                }
            )
                .populate(
                    "customer",
                    "name phone city area"
                )
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                );


        if (!updatedJob) {
            return res.status(409).json({
                success: false,
                message:
                    "This job was accepted by another worker just now"
            });
        }


        worker.acceptedJobs =
            (worker.acceptedJobs || 0) + 1;

        await worker.save();


        // Customer notification
        await notify({
            recipient:
                updatedJob.customer?._id ||
                updatedJob.customer,

            recipientRole:
                "customer",

            type:
                "job_accepted",

            title:
                "Worker Assigned",

            message:
                `A worker has accepted your job "${updatedJob.title}".`,

            job:
                updatedJob._id
        });


        res.status(200).json({
            success: true,

            message:
                "Job accepted successfully",

            distance:
                Number(
                    distance.toFixed(2)
                ),

            job:
                updatedJob
        });

    } catch (error) {
        console.error(
            "Accept job error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while accepting job"
        });
    }
};


// ======================================================
// START TRAVEL
// ======================================================

const startTravel = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                assignedWorker:
                    worker._id,

                status:
                    "accepted"
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Accepted job not found"
            });
        }


        const otp =
            generateOTP();

        job.otp =
            String(otp);

        job.otpVerified =
            false;

        job.status =
            "on_the_way";

        await job.save();


        // Customer notification
        await notify({
            recipient:
                job.customer,

            recipientRole:
                "customer",

            type:
                "worker_on_the_way",

            title:
                "Worker Is On The Way",

            message:
                `The worker is on the way for "${job.title}".`,

            job:
                job._id
        });


        res.status(200).json({
            success: true,

            message:
                "Worker is on the way",

            jobId:
                job._id,

            status:
                job.status,

            otp
        });

    } catch (error) {
        console.error(
            "Start travel error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while starting travel"
        });
    }
};


// ======================================================
// VERIFY OTP
// ======================================================

const verifyJobOTP = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                assignedWorker:
                    worker._id,

                status:
                    "on_the_way"
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or OTP cannot be verified"
            });
        }

        const {
            otp
        } = req.body || {};

        if (!otp) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP is required"
            });
        }

        if (
            String(job.otp) !==
            String(otp)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid OTP"
            });
        }

        job.otpVerified =
            true;

        job.otp =
            null;

        job.status =
            "in_progress";

        await job.save();


        // Customer notification
        await notify({
            recipient:
                job.customer,

            recipientRole:
                "customer",

            type:
                "otp_verified",

            title:
                "Job Started",

            message:
                `OTP verified. Your job "${job.title}" has started.`,

            job:
                job._id
        });


        res.status(200).json({
            success: true,

            message:
                "OTP verified. Job started successfully",

            jobId:
                job._id,

            status:
                job.status
        });

    } catch (error) {
        console.error(
            "OTP verification error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while verifying OTP"
        });
    }
};


// ======================================================
// SET FINAL PRICE
// ======================================================

const setFinalPrice = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        const {
            finalPrice
        } = req.body || {};

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const price =
            Number(finalPrice);

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Final price must be a valid positive number"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                assignedWorker:
                    req.user.id
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or you are not assigned to this job"
            });
        }

        if (
            job.status !==
            "in_progress"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Final price can only be set while the job is in progress"
            });
        }

        if (
            job.finalPrice > 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Final price has already been set"
            });
        }

        job.finalPrice =
            price;

        job.paymentStatus =
            "pending";

        await job.save();


        // Customer notification
        await notify({
            recipient:
                job.customer,

            recipientRole:
                "customer",

            type:
                "final_price",

            title:
                "Final Price Set",

            message:
                `Final price for "${job.title}" is ₹${job.finalPrice}.`,

            job:
                job._id
        });


        res.status(200).json({
            success: true,

            message:
                "Final price updated successfully",

            finalPrice:
                job.finalPrice,

            paymentStatus:
                job.paymentStatus,

            jobId:
                job._id
        });

    } catch (error) {
        console.error(
            "Set final price error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while setting final price"
        });
    }
};


// ======================================================
// FAKE PAYMENT
// ======================================================

const makePayment = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                customer:
                    req.user.id
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }

        if (
            job.status !==
            "in_progress"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment can only be made while the job is in progress"
            });
        }

        if (
            !job.finalPrice ||
            job.finalPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Final price has not been set yet"
            });
        }

        if (
            job.paymentStatus ===
            "paid"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment has already been completed",

                transactionId:
                    job.transactionId
            });
        }


        // ==================================================
        // MOCK PAYMENT
        // ==================================================

        const transactionId =
            `MOCK_${Date.now()}_${Math.floor(
                Math.random() * 100000
            )}`;

        job.paymentStatus =
            "paid";

        job.paymentMethod =
            "mock";

        job.transactionId =
            transactionId;

        job.paidAt =
            new Date();

        await job.save();


        // Worker notification
        await notify({
            recipient:
                job.assignedWorker,

            recipientRole:
                "worker",

            type:
                "payment",

            title:
                "Payment Received",

            message:
                `Customer completed the mock payment of ₹${job.finalPrice}.`,

            job:
                job._id
        });


        res.status(200).json({
            success: true,

            message:
                "Mock payment successful",

            payment: {
                amount:
                    job.finalPrice,

                paymentMethod:
                    job.paymentMethod,

                paymentStatus:
                    job.paymentStatus,

                transactionId:
                    job.transactionId,

                paidAt:
                    job.paidAt
            },

            jobId:
                job._id
        });

    } catch (error) {
        console.error(
            "Fake payment error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while processing payment"
        });
    }
};


// ======================================================
// COMPLETE JOB
// ======================================================

const completeJob = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                assignedWorker:
                    worker._id,

                status:
                    "in_progress"
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or job is not in progress"
            });
        }

        if (
            !job.finalPrice ||
            job.finalPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please set final price before completing the job"
            });
        }

        if (
            job.paymentStatus !==
            "paid"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer payment is pending"
            });
        }

        job.status =
            "completed";

        await job.save();


        worker.completedJobs =
            (worker.completedJobs || 0) + 1;

        await worker.save();


        // Customer notification
        await notify({
            recipient:
                job.customer,

            recipientRole:
                "customer",

            type:
                "job_completed",

            title:
                "Job Completed",

            message:
                `Your job "${job.title}" has been completed successfully.`,

            job:
                job._id
        });


        const completedJob =
            await Job.findById(
                job._id
            )
                .populate(
                    "customer",
                    "name phone city area"
                )
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                );


        res.status(200).json({
            success: true,

            message:
                "Job completed successfully",

            job:
                completedJob
        });

    } catch (error) {
        console.error(
            "Complete job error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while completing job"
        });
    }
};


// ======================================================
// RATE WORKER
// ======================================================

const rateWorker = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        const {
            rating,
            review
        } = req.body || {};

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const numericRating =
            Number(rating);

        if (
            !Number.isFinite(
                numericRating
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be between 1 and 5"
            });
        }

        const job =
            await Job.findOne({
                _id:
                    jobId,

                customer:
                    req.user.id
            });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }

        if (
            job.status !==
            "completed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You can rate the worker only after job completion"
            });
        }

        if (!job.assignedWorker) {
            return res.status(400).json({
                success: false,
                message:
                    "No worker was assigned to this job"
            });
        }

        if (
            job.rating !== null &&
            job.rating !== undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already rated this job"
            });
        }

        const worker =
            await Worker.findById(
                job.assignedWorker
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }


        const oldCompletedJobs =
            Math.max(
                (worker.completedJobs || 0) - 1,
                0
            );

        const oldRating =
            Number(
                worker.rating
            ) || 0;

        let newRating;

        if (
            oldCompletedJobs === 0
        ) {
            newRating =
                numericRating;
        } else {
            newRating =
                (
                    (
                        oldRating *
                        oldCompletedJobs
                    ) +
                    numericRating
                ) /
                (
                    oldCompletedJobs + 1
                );
        }


        job.rating =
            numericRating;

        job.review =
            typeof review === "string"
                ? review.trim()
                : "";

        job.ratedAt =
            new Date();

        await job.save();


        worker.rating =
            Number(
                newRating.toFixed(1)
            );

        await worker.save();


        res.status(200).json({
            success: true,

            message:
                "Worker rated successfully",

            rating:
                numericRating,

            review:
                job.review,

            worker: {
                id:
                    worker._id,

                name:
                    worker.name,

                rating:
                    worker.rating
            }
        });

    } catch (error) {
        console.error(
            "Rate worker error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while rating worker"
        });
    }
};


// ======================================================
// CANCEL JOB
// CUSTOMER + WORKER
// ======================================================

const cancelJob = async (req, res) => {
    try {
        const {
            jobId
        } = req.params;

        const {
            reason
        } = req.body || {};

        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job ID"
            });
        }

        const job =
            await Job.findById(
                jobId
            );

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }


        const currentUser =
            String(req.user.id);

        const customerId =
            String(job.customer);

        const workerId =
            job.assignedWorker
                ? String(
                    job.assignedWorker
                )
                : null;


        let cancelledBy;


        if (
            currentUser ===
            customerId
        ) {
            cancelledBy =
                "customer";

        } else if (
            currentUser ===
            workerId
        ) {
            cancelledBy =
                "worker";

        } else {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to cancel this job"
            });
        }


        if (
            job.status ===
            "completed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Completed job cannot be cancelled"
            });
        }


        if (
            job.status ===
            "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Job is already cancelled"
            });
        }


        if (
            job.paymentStatus ===
            "paid"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Paid job cannot be cancelled in the mini project"
            });
        }


        job.status =
            "cancelled";

        job.cancellationReason =
            reason
                ? String(reason).trim()
                : "No reason provided";

        job.cancelledBy =
            cancelledBy;

        job.cancelledAt =
            new Date();

        await job.save();


        // ==================================================
        // WORKER CANCELS
        // CUSTOMER NOTIFICATION
        // ==================================================

        if (
            cancelledBy ===
            "worker"
        ) {
            await notify({
                recipient:
                    job.customer,

                recipientRole:
                    "customer",

                type:
                    "job_cancelled",

                title:
                    "Job Cancelled",

                message:
                    `The worker cancelled "${job.title}". Reason: ${job.cancellationReason}`,

                job:
                    job._id
            });
        }


        // ==================================================
        // CUSTOMER CANCELS
        // WORKER NOTIFICATION
        // ==================================================

        if (
            cancelledBy ===
            "customer" &&
            job.assignedWorker
        ) {
            await notify({
                recipient:
                    job.assignedWorker,

                recipientRole:
                    "worker",

                type:
                    "job_cancelled",

                title:
                    "Job Cancelled",

                message:
                    `The customer cancelled "${job.title}". Reason: ${job.cancellationReason}`,

                job:
                    job._id
            });
        }


        // Worker becomes available again
        if (
            job.assignedWorker
        ) {
            const worker =
                await Worker.findById(
                    job.assignedWorker
                );

            if (worker) {
                worker.isAvailable =
                    true;

                await worker.save();
            }
        }


        const cancelledJob =
            await Job.findById(
                job._id
            )
                .populate(
                    "customer",
                    "name phone city area"
                )
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                );


        res.status(200).json({
            success: true,

            message:
                "Job cancelled successfully",

            cancelledBy,

            job:
                cancelledJob
        });

    } catch (error) {
        console.error(
            "Cancel job error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while cancelling job"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createJob,
    getMyJobs,
    getJobDetails,
    getAvailableJobs,
    acceptJob,
    startTravel,
    verifyJobOTP,
    setFinalPrice,
    makePayment,
    completeJob,
    rateWorker,
    cancelJob
};