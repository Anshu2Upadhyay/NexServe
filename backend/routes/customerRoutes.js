const express = require("express");

const {
  getCustomerDashboard,
} = require("../controllers/customerController");

const {
  getCustomerWorkers,
} = require("../controllers/customerWorkerController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// ======================================================
// CUSTOMER DASHBOARD
// ======================================================

router.get(
  "/dashboard",
  protect,
  authorize("customer"),
  getCustomerDashboard
);

// ======================================================
// FIND AVAILABLE WORKERS
// ======================================================

router.get(
  "/workers",
  protect,
  authorize("customer"),
  getCustomerWorkers
);

module.exports = router;