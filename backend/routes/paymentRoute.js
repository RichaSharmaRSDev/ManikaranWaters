const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createPayment,
  getPaymentsForDay,
  getPaymentsForRange,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/payment/new").post(isAuthenticatedUser, createPayment);
router.route("/payments/range").get(getPaymentsForRange);
router
  .route("/payments/:paymentDate?")
  .get(isAuthenticatedUser, getPaymentsForDay);

module.exports = router;
