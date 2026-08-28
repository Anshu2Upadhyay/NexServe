const express = require("express");

const {
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
} = require("../controllers/jobController");

const {
    getWorkerJobDetails
} = require("../controllers/workerJobController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Create a new job
router.post(
    "/",
    protect,
    authorize("customer"),
    createJob
);


// Get logged-in customer's jobs
router.get(
    "/my-jobs",
    protect,
    authorize("customer"),
    getMyJobs
);


// ======================================================
// WORKER ROUTES
// ======================================================

// Get available jobs for worker
router.get(
    "/available",
    protect,
    authorize("worker"),
    getAvailableJobs
);


// Get worker-specific job details
// IMPORTANT:
// Keep this before /:jobId
router.get(
    "/worker/:jobId",
    protect,
    authorize("worker"),
    getWorkerJobDetails
);


// ======================================================
// CUSTOMER SINGLE JOB DETAILS
// ======================================================

router.get(
    "/:jobId",
    protect,
    authorize("customer"),
    getJobDetails
);


// ======================================================
// WORKER JOB ACTIONS
// ======================================================

// Accept job
router.patch(
    "/:jobId/accept",
    protect,
    authorize("worker"),
    acceptJob
);


// Worker starts travelling to customer
router.patch(
    "/:jobId/on-the-way",
    protect,
    authorize("worker"),
    startTravel
);


// Verify customer's OTP
router.patch(
    "/:jobId/verify-otp",
    protect,
    authorize("worker"),
    verifyJobOTP
);


// Set final price after inspecting the work
router.patch(
    "/:jobId/final-price",
    protect,
    authorize("worker"),
    setFinalPrice
);


// Complete job
router.patch(
    "/:jobId/complete",
    protect,
    authorize("worker"),
    completeJob
);


// ======================================================
// CUSTOMER PAYMENT
// MINI PROJECT = MOCK PAYMENT
// ======================================================

router.patch(
    "/:jobId/payment",
    protect,
    authorize("customer"),
    makePayment
);


// ======================================================
// CUSTOMER RATING
// ======================================================

router.patch(
    "/:jobId/rate",
    protect,
    authorize("customer"),
    rateWorker
);


// ======================================================
// JOB CANCELLATION
// ======================================================

// Customer cancels job
router.patch(
    "/:jobId/cancel",
    protect,
    authorize("customer"),
    cancelJob
);


// Worker cancels job
router.patch(
    "/:jobId/worker-cancel",
    protect,
    authorize("worker"),
    cancelJob
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;