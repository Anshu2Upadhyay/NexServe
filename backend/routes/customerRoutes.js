const express = require("express");

const {
    getCustomerDashboard
} = require("../controllers/customerController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER DASHBOARD
// ======================================================

router.get(
    "/dashboard",
    protect,
    authorize("customer"),
    getCustomerDashboard
);


module.exports = router;