const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createPayment,
  getPaymentsForDay,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/payment/new").post(isAuthenticatedUser, createPayment);
router
  .route("/payments/:paymentDate?")
  .get(isAuthenticatedUser, getPaymentsForDay);

module.exports = router;
