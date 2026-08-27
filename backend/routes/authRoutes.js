const express = require("express");

const {
    registerCustomer,
    registerWorker,
    loginCustomer,
    loginWorker
} = require("../controllers/authController");

const router = express.Router();

router.post("/customer/register", registerCustomer);
router.post("/worker/register", registerWorker);

router.post("/customer/login", loginCustomer);
router.post("/worker/login", loginWorker);

module.exports = router;