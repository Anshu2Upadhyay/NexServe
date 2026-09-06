const express = require("express");

const {
    getMyProfile,
    updateMyProfile,
    updateLocation
} = require("../controllers/userController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER PROFILE
// ======================================================

router.get(
    "/profile",
    protect,
    authorize("customer"),
    getMyProfile
);


router.patch(
    "/profile",
    protect,
    authorize("customer"),
    updateMyProfile
);


// ======================================================
// CUSTOMER GPS LOCATION
// ======================================================

router.patch(
    "/location",
    protect,
    authorize("customer"),
    updateLocation
);


module.exports = router;