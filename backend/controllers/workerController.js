const mongoose = require("mongoose");

const Worker = require("../models/Worker");
const Job = require("../models/Job");


// ======================================================
// GET LOGGED-IN WORKER PROFILE
// ======================================================

const getMyProfile = async (req, res) => {
    try {
        const worker =
            await Worker.findById(
                req.user.id
            ).select("-password");

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }

        res.status(200).json({
            success: true,
            worker
        });

    } catch (error) {
        console.error(
            "Get worker profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching profile"
        });
    }
};


// ======================================================
// UPDATE WORKER PROFILE
// ======================================================

const updateMyProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            city,
            area,
            skills,
            experience
        } = req.body || {};

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


        if (name !== undefined) {
            worker.name =
                String(name).trim();
        }

        if (phone !== undefined) {
            worker.phone =
                String(phone).trim();
        }

        if (city !== undefined) {
            worker.city =
                String(city).trim();
        }

        if (area !== undefined) {
            worker.area =
                String(area).trim();
        }


        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Skills must be an array"
                });
            }

            worker.skills =
                skills
                    .map(skill =>
                        String(skill).trim()
                    )
                    .filter(Boolean);
        }


        if (experience !== undefined) {
            worker.experience =
                experience;
        }


        await worker.save();

        const updatedWorker =
            await Worker.findById(
                worker._id
            ).select("-password");

        res.status(200).json({
            success: true,
            message:
                "Worker profile updated successfully",
            worker:
                updatedWorker
        });

    } catch (error) {
        console.error(
            "Update worker profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating profile"
        });
    }
};


// ======================================================
// UPDATE WORKER ONLINE/OFFLINE STATUS
// ======================================================

const updateAvailability = async (req, res) => {
    try {
        const body =
            req.body || {};

        const {
            isAvailable
        } = body;

        if (
            typeof isAvailable !==
            "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "isAvailable must be true or false"
            });
        }

        const worker =
            await Worker.findByIdAndUpdate(
                req.user.id,
                {
                    isAvailable
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                isAvailable
                    ? "You are now online"
                    : "You are now offline",
            worker
        });

    } catch (error) {
        console.error(
            "Update availability error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating availability"
        });
    }
};


// ======================================================
// UPDATE WORKER CURRENT LOCATION
// ======================================================

const updateLocation = async (req, res) => {
    try {
        const body =
            req.body || {};

        const {
            latitude,
            longitude
        } = body;

        if (
            typeof latitude !==
                "number" ||
            typeof longitude !==
                "number"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude must be numbers"
            });
        }

        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid latitude or longitude"
            });
        }

        const worker =
            await Worker.findByIdAndUpdate(
                req.user.id,
                {
                    location: {
                        latitude,
                        longitude
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Worker location updated successfully",
            location:
                worker.location
        });

    } catch (error) {
        console.error(
            "Update location error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating location"
        });
    }
};


// ======================================================
// WORKER DASHBOARD
// ======================================================

const getWorkerDashboard = async (req, res) => {
    try {
        const worker =
            await Worker.findById(
                req.user.id
            ).select("-password");

        if (!worker) {
            return res.status(404).json({
                success: false,
                message:
                    "Worker not found"
            });
        }


        const [
            totalJobs,
            activeJobs,
            completedJobs,
            cancelledJobs
        ] = await Promise.all([

            Job.countDocuments({
                assignedWorker:
                    worker._id
            }),

            Job.countDocuments({
                assignedWorker:
                    worker._id,

                status: {
                    $in: [
                        "accepted",
                        "on_the_way",
                        "in_progress"
                    ]
                }
            }),

            Job.countDocuments({
                assignedWorker:
                    worker._id,

                status:
                    "completed"
            }),

            Job.countDocuments({
                assignedWorker:
                    worker._id,

                status:
                    "cancelled"
            })
        ]);


        // Nearby available jobs
        let nearbyJobs = [];

        if (
            worker.isAvailable &&
            worker.location?.latitude !==
                undefined &&
            worker.location?.longitude !==
                undefined
        ) {
            nearbyJobs =
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
                    })
                    .limit(10);
        }


        res.status(200).json({
            success: true,

            dashboard: {
                worker: {
                    id:
                        worker._id,

                    name:
                        worker.name,

                    city:
                        worker.city,

                    area:
                        worker.area,

                    skills:
                        worker.skills,

                    isAvailable:
                        worker.isAvailable,

                    rating:
                        worker.rating || 0
                },

                statistics: {
                    totalJobs,
                    activeJobs,
                    completedJobs,
                    cancelledJobs,

                    acceptedJobs:
                        worker.acceptedJobs || 0,

                    completedJobsCount:
                        worker.completedJobs || 0,

                    rating:
                        worker.rating || 0
                },

                nearbyJobs
            }
        });

    } catch (error) {
        console.error(
            "Worker dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while loading worker dashboard"
        });
    }
};


// ======================================================
// WORKER EARNINGS
// MINI PROJECT = FAKE/DISPLAY ONLY
// ======================================================

const getWorkerEarnings = async (req, res) => {
    try {
        const jobs =
            await Job.find({
                assignedWorker:
                    req.user.id,

                status:
                    "completed",

                paymentStatus:
                    "paid"
            })
                .select(
                    "title category finalPrice paymentStatus transactionId paidAt updatedAt"
                )
                .sort({
                    updatedAt: -1
                });


        const totalEarnings =
            jobs.reduce(
                (total, job) =>
                    total +
                    Number(
                        job.finalPrice || 0
                    ),
                0
            );


        res.status(200).json({
            success: true,

            earnings: {
                total:
                    totalEarnings,

                completedJobs:
                    jobs.length,

                jobs
            }
        });

    } catch (error) {
        console.error(
            "Worker earnings error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while loading earnings"
        });
    }
};


// ======================================================
// SEARCH + FILTER AVAILABLE JOBS
// ======================================================

const searchWorkerJobs = async (req, res) => {
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


        const {
            category,
            skill,
            urgency,
            minPrice,
            maxPrice,
            status,
            limit = 20
        } = req.query;


        const query = {
            city:
                worker.city,

            assignedWorker:
                null
        };


        // Status filter
        if (status) {
            query.status =
                status;
        } else {
            query.status = {
                $in: [
                    "posted",
                    "searching"
                ]
            };
        }


        // Category filter
        if (category) {
            query.category = {
                $regex:
                    String(category),
                $options:
                    "i"
            };
        }


        // Skill filter
        if (skill) {
            query.requiredSkill = {
                $regex:
                    String(skill),
                $options:
                    "i"
            };
        }


        // Urgency filter
        if (urgency) {
            query.urgency =
                urgency;
        }


        // Price filters
        if (
            minPrice !==
            undefined
        ) {
            query.estimatedMaxPrice = {
                $gte:
                    Number(minPrice)
            };
        }

        if (
            maxPrice !==
            undefined
        ) {
            query.estimatedMinPrice = {
                $lte:
                    Number(maxPrice)
            };
        }


        const jobs =
            await Job.find(query)
                .populate(
                    "customer",
                    "name phone city area"
                )
                .sort({
                    createdAt: -1
                })
                .limit(
                    Math.min(
                        Number(limit) || 20,
                        50
                    )
                );


        res.status(200).json({
            success: true,

            count:
                jobs.length,

            filters: {
                category:
                    category || null,

                skill:
                    skill || null,

                urgency:
                    urgency || null,

                status:
                    status || null,

                minPrice:
                    minPrice || null,

                maxPrice:
                    maxPrice || null
            },

            jobs
        });

    } catch (error) {
        console.error(
            "Search worker jobs error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while searching jobs"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateAvailability,
    updateLocation,

    getWorkerDashboard,
    getWorkerEarnings,
    searchWorkerJobs
};