const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createPayment,
  getPaymentsForDay,
  getPaymentsForRange,
  deletePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.route("/payment/new").post(isAuthenticatedUser, createPayment);
router.route("/payments/range").get(getPaymentsForRange);
router
  .route("/payments/:paymentDate?")
  .get(isAuthenticatedUser, getPaymentsForDay);

router.route("/expenses/:customerId/:paymentId").delete(deletePayment);

module.exports = router;
