const mongoose = require("mongoose");

const Job = require("../models/Job");
const Worker = require("../models/Worker");

const {
    calculateDistance
} = require("../services/locationService");

// ======================================================
// GET WORKER JOB DETAILS
// ======================================================
// Worker sirf wahi job dekh sakta hai jo:
// 1. Available hai
// 2. Ya us worker ko assigned hai
// ======================================================

const getWorkerJobDetails = async (
    req,
    res
) => {
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
                message: "Invalid job ID"
            });
        }

        const worker =
            await Worker.findById(
                req.user.id
            );

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }

        const job =
            await Job.findById(jobId)
                .populate(
                    "customer",
                    "name phone city area"
                )
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const isAssigned =
            job.assignedWorker &&
            String(
                job.assignedWorker._id ||
                job.assignedWorker
            ) ===
            String(worker._id);

        const isAvailable =
            !job.assignedWorker &&
            [
                "posted",
                "searching"
            ].includes(job.status);

        if (
            !isAssigned &&
            !isAvailable
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to view this job"
            });
        }

        let distance = null;

        if (
            worker.location?.latitude !==
                undefined &&
            worker.location?.latitude !==
                null &&
            worker.location?.longitude !==
                undefined &&
            worker.location?.longitude !==
                null &&
            job.location?.latitude !==
                undefined &&
            job.location?.longitude !==
                undefined
        ) {
            distance =
                calculateDistance(
                    worker.location.latitude,
                    worker.location.longitude,
                    job.location.latitude,
                    job.location.longitude
                );

            distance =
                Number(
                    distance.toFixed(2)
                );
        }

        res.status(200).json({
            success: true,
            job: {
                ...job.toObject(),
                distance
            }
        });

    } catch (error) {

        console.error(
            "Get worker job details error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching worker job details"
        });
    }
};

module.exports = {
    getWorkerJobDetails
};