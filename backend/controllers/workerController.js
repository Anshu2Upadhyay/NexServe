const Worker = require("../models/Worker");
const Job = require("../models/Job");

// ======================================================
// CONSTANTS
// ======================================================

const SERVICE_RADIUS_KM = 5;

const ACTIVE_JOB_STATUSES = [
    "accepted",
    "on_the_way",
    "in_progress"
];

const AVAILABLE_JOB_STATUSES = [
    "posted",
    "searching"
];

// ======================================================
// HELPERS
// ======================================================

const hasValidCoordinates = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

const normalizeString = (value) => {
    return String(value || "").trim().toLowerCase();
};

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI /
        180;

    const dLon =
        (lon2 - lon1) *
        Math.PI /
        180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(
            lat1 * Math.PI / 180
        ) *
        Math.cos(
            lat2 * Math.PI / 180
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};

// ======================================================
// GET LOGGED-IN WORKER PROFILE
// ======================================================

const getMyProfile = async (req, res) => {
    try {
        const worker = await Worker.findById(
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

        const worker = await Worker.findById(
            req.user.id
        );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }

        if (name !== undefined) {
            const cleanName =
                String(name).trim();

            if (cleanName.length < 2) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Name must contain at least 2 characters"
                });
            }

            worker.name = cleanName;
        }

        if (phone !== undefined) {
            const cleanPhone =
                String(phone).trim();

            if (
                cleanPhone &&
                !/^[6-9]\d{9}$/.test(cleanPhone)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid 10-digit Indian mobile number"
                });
            }

            worker.phone = cleanPhone;
        }

        if (city !== undefined) {
            const cleanCity =
                String(city).trim();

            if (!cleanCity) {
                return res.status(400).json({
                    success: false,
                    message:
                        "City cannot be empty"
                });
            }

            worker.city = cleanCity;
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

            const cleanedSkills =
                skills
                    .map(skill =>
                        String(skill).trim()
                    )
                    .filter(Boolean);

            worker.skills = [
                ...new Set(cleanedSkills)
            ];
        }

        if (experience !== undefined) {
            const numericExperience =
                Number(experience);

            if (
                !Number.isFinite(
                    numericExperience
                ) ||
                numericExperience < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Experience must be a valid non-negative number"
                });
            }

            worker.experience =
                numericExperience;
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
            worker: updatedWorker
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
        const {
            isAvailable
        } = req.body || {};

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

        // ==============================================
        // GOING ONLINE
        // ==============================================

        if (isAvailable) {
            const activeJob =
                await Job.findOne({
                    assignedWorker:
                        worker._id,

                    status: {
                        $in:
                            ACTIVE_JOB_STATUSES
                    }
                }).select(
                    "_id title status"
                );

            if (activeJob) {
                return res.status(409).json({
                    success: false,
                    message:
                        "You cannot go online while you have an active job. Complete or cancel the current job first.",
                    activeJob
                });
            }

            if (
                !hasValidCoordinates(
                    worker.location?.latitude,
                    worker.location?.longitude
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please update your current location before going online"
                });
            }

            if (
                !String(
                    worker.city || ""
                ).trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please update your city before going online"
                });
            }

            if (
                !Array.isArray(worker.skills) ||
                worker.skills.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please add at least one skill before going online"
                });
            }
        }

        // ==============================================
        // UPDATE AVAILABILITY
        // ==============================================

        const updatedWorker =
            await Worker.findOneAndUpdate(
                {
                    _id: worker._id
                },
                {
                    $set: {
                        isAvailable
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

        if (!updatedWorker) {
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

            worker: updatedWorker
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
        const {
            latitude,
            longitude
        } = req.body || {};

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

        if (
            !hasValidCoordinates(
                lat,
                lng
            )
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
                        latitude: lat,
                        longitude: lng
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
                    $in:
                        ACTIVE_JOB_STATUSES
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

        // ==============================================
        // EFFECTIVE AVAILABILITY
        // ==============================================

        let effectiveAvailability =
            Boolean(
                worker.isAvailable
            );

        if (activeJobs > 0) {
            effectiveAvailability = false;
        }

        // ==============================================
        // NEARBY AVAILABLE JOBS
        // ==============================================

        let nearbyJobs = [];

        const workerHasLocation =
            hasValidCoordinates(
                worker.location?.latitude,
                worker.location?.longitude
            );

        const workerHasSkills =
            Array.isArray(
                worker.skills
            ) &&
            worker.skills.length > 0;

        if (
            effectiveAvailability &&
            workerHasLocation &&
            workerHasSkills
        ) {
            const jobs =
                await Job.find({
                    city:
                        worker.city,

                    requiredSkill: {
                        $in:
                            worker.skills
                    },

                    status: {
                        $in:
                            AVAILABLE_JOB_STATUSES
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

            nearbyJobs =
                jobs
                    .map(job => {

                        if (
                            !hasValidCoordinates(
                                job.location?.latitude,
                                job.location?.longitude
                            )
                        ) {
                            return null;
                        }

                        const distance =
                            calculateDistance(
                                worker.location.latitude,
                                worker.location.longitude,
                                job.location.latitude,
                                job.location.longitude
                            );

                        if (
                            !Number.isFinite(
                                distance
                            ) ||
                            distance >
                                SERVICE_RADIUS_KM
                        ) {
                            return null;
                        }

                        return {
                            ...job.toObject(),

                            distance:
                                Number(
                                    distance.toFixed(2)
                                )
                        };
                    })
                    .filter(Boolean)
                    .sort(
                        (a, b) =>
                            a.distance -
                            b.distance
                    )
                    .slice(0, 10);
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
                        effectiveAvailability,

                    rating:
                        worker.rating || 0,

                    location:
                        worker.location
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
                (
                    total,
                    job
                ) =>
                    total +
                    (
                        Number(
                            job.finalPrice
                        ) || 0
                    ),
                0
            );

        res.status(200).json({
            success: true,

            earnings: {
                total:
                    Number(
                        totalEarnings.toFixed(2)
                    ),

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

        // ==============================================
        // ACTIVE JOB PROTECTION
        // ==============================================

        const activeJob =
            await Job.findOne({
                assignedWorker:
                    worker._id,

                status: {
                    $in:
                        ACTIVE_JOB_STATUSES
                }
            }).select(
                "_id title status"
            );

        if (activeJob) {
            return res.status(200).json({
                success: true,

                count: 0,

                message:
                    "You already have an active job",

                activeJob,

                jobs: []
            });
        }

        // ==============================================
        // LOCATION CHECK
        // ==============================================

        if (
            !hasValidCoordinates(
                worker.location?.latitude,
                worker.location?.longitude
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please update your current location first"
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
        } = req.query || {};

        // ==============================================
        // LIMIT
        // ==============================================

        const parsedLimit =
            Number(limit);

        const safeLimit =
            Number.isFinite(
                parsedLimit
            )
                ? Math.min(
                    Math.max(
                        Math.floor(
                            parsedLimit
                        ),
                        1
                    ),
                    50
                )
                : 20;

        // ==============================================
        // BASE QUERY
        // ==============================================

        const query = {
            city:
                worker.city,

            assignedWorker:
                null
        };

        // ==============================================
        // STATUS
        // ==============================================

        if (status) {
            if (
                !AVAILABLE_JOB_STATUSES.includes(
                    String(status)
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid job status"
                });
            }

            query.status =
                String(status);

        } else {
            query.status = {
                $in:
                    AVAILABLE_JOB_STATUSES
            };
        }

        // ==============================================
        // CATEGORY
        // ==============================================

        if (category) {
            query.category = {
                $regex:
                    String(category).trim(),
                $options: "i"
            };
        }

        // ==============================================
        // SKILL
        // ==============================================

        if (skill) {
            query.requiredSkill = {
                $regex:
                    String(skill).trim(),
                $options: "i"
            };
        }

        // ==============================================
        // URGENCY
        // ==============================================

        if (urgency) {
            const allowedUrgencies = [
                "normal",
                "urgent"
            ];

            if (
                !allowedUrgencies.includes(
                    normalizeString(
                        urgency
                    )
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid urgency"
                });
            }

            query.urgency =
                normalizeString(
                    urgency
                );
        }

        // ==============================================
        // PRICE FILTERS
        // ==============================================

        if (
            minPrice !==
            undefined
        ) {
            const min =
                Number(minPrice);

            if (
                !Number.isFinite(min) ||
                min < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid minimum price"
                });
            }

            query.estimatedMaxPrice = {
                $gte: min
            };
        }

        if (
            maxPrice !==
            undefined
        ) {
            const max =
                Number(maxPrice);

            if (
                !Number.isFinite(max) ||
                max < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid maximum price"
                });
            }

            query.estimatedMinPrice = {
                $lte: max
            };
        }

        if (
            minPrice !== undefined &&
            maxPrice !== undefined
        ) {
            const min =
                Number(minPrice);

            const max =
                Number(maxPrice);

            if (min > max) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Minimum price cannot be greater than maximum price"
                });
            }
        }

        // ==============================================
        // FETCH JOBS
        // ==============================================

        const jobs =
            await Job.find(query)
                .populate(
                    "customer",
                    "name phone city area"
                )
                .sort({
                    createdAt: -1
                });

        // ==============================================
        // DISTANCE FILTER
        // ==============================================

        const filteredJobs =
            jobs
                .map(job => {

                    if (
                        !hasValidCoordinates(
                            job.location?.latitude,
                            job.location?.longitude
                        )
                    ) {
                        return null;
                    }

                    const distance =
                        calculateDistance(
                            worker.location.latitude,
                            worker.location.longitude,
                            job.location.latitude,
                            job.location.longitude
                        );

                    if (
                        !Number.isFinite(
                            distance
                        ) ||
                        distance >
                            SERVICE_RADIUS_KM
                    ) {
                        return null;
                    }

                    return {
                        ...job.toObject(),

                        distance:
                            Number(
                                distance.toFixed(2)
                            )
                    };
                })
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        a.distance -
                        b.distance
                )
                .slice(
                    0,
                    safeLimit
                );

        res.status(200).json({
            success: true,

            count:
                filteredJobs.length,

            radius:
                SERVICE_RADIUS_KM,

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
                    minPrice !== undefined
                        ? Number(minPrice)
                        : null,

                maxPrice:
                    maxPrice !== undefined
                        ? Number(maxPrice)
                        : null
            },

            jobs:
                filteredJobs
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