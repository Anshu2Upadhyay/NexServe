const express = require("express");

const {
    getMyProfile,
    updateMyProfile,
    updateAvailability,
    updateLocation,
    getWorkerDashboard,
    getWorkerEarnings,
    searchWorkerJobs
} = require("../controllers/workerController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// WORKER DASHBOARD
// ======================================================

router.get(
    "/dashboard",
    protect,
    authorize("worker"),
    getWorkerDashboard
);


// ======================================================
// WORKER EARNINGS
// ======================================================

router.get(
    "/earnings",
    protect,
    authorize("worker"),
    getWorkerEarnings
);


// ======================================================
// WORKER PROFILE
// ======================================================

router.get(
    "/profile",
    protect,
    authorize("worker"),
    getMyProfile
);

router.patch(
    "/profile",
    protect,
    authorize("worker"),
    updateMyProfile
);


// ======================================================
// WORKER AVAILABILITY
// ======================================================

router.patch(
    "/availability",
    protect,
    authorize("worker"),
    updateAvailability
);


// ======================================================
// WORKER LOCATION
// ======================================================

router.patch(
    "/location",
    protect,
    authorize("worker"),
    updateLocation
);


// ======================================================
// JOB SEARCH + FILTERS
// ======================================================

router.get(
    "/jobs/search",
    protect,
    authorize("worker"),
    searchWorkerJobs
);


module.exports = router;