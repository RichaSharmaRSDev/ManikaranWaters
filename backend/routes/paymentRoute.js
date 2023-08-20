const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { createPayment } = require("../controllers/paymentController");

const router = express.Router();

router.route("/payment/new").post(isAuthenticatedUser, createPayment);

module.exports = router;
