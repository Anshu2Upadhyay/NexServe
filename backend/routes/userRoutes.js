const express = require("express");

const { getMyProfile } = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/profile",
    protect,
    authorize("customer"),
    getMyProfile
);

module.exports = router;