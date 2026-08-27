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
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Create job
router.post(
    "/",
    protect,
    authorize("customer"),
    createJob
);


// Customer's jobs
router.get(
    "/my-jobs",
    protect,
    authorize("customer"),
    getMyJobs
);


// Single job details
router.get(
    "/:jobId",
    protect,
    authorize("customer"),
    getJobDetails
);


// ======================================================
// WORKER ROUTES
// ======================================================

// Available nearby jobs
router.get(
    "/available",
    protect,
    authorize("worker"),
    getAvailableJobs
);


// Accept job
router.patch(
    "/:jobId/accept",
    protect,
    authorize("worker"),
    acceptJob
);


// Worker starts travelling
router.patch(
    "/:jobId/on-the-way",
    protect,
    authorize("worker"),
    startTravel
);


// Verify customer OTP
router.patch(
    "/:jobId/verify-otp",
    protect,
    authorize("worker"),
    verifyJobOTP
);


// Set final price
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
// PAYMENT ROUTE
// MINI PROJECT = FAKE PAYMENT
// ======================================================

// Customer makes mock payment
router.patch(
    "/:jobId/payment",
    protect,
    authorize("customer"),
    makePayment
);


// ======================================================
// RATING ROUTE
// ======================================================

// Customer rates worker
router.patch(
    "/:jobId/rate",
    protect,
    authorize("customer"),
    rateWorker
);


// ======================================================
// CANCELLATION
// ======================================================

// Customer can cancel
router.patch(
    "/:jobId/cancel",
    protect,
    authorize("customer"),
    cancelJob
);


// Worker can cancel
router.patch(
    "/:jobId/worker-cancel",
    protect,
    authorize("worker"),
    cancelJob
);


module.exports = router;