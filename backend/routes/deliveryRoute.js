const express = require("express");
const {
  getDeliveriesForDay,
  createDelivery,
  getDeliveryDetails,
  updateDelivery,
  deleteDelivery,
  getDeliveriesForRange,
} = require("../controllers/deliveryController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/deliveries/range").get(getDeliveriesForRange);
router.route("/deliveries/:deliveryDate?").get(getDeliveriesForDay);
router.route("/delivery/new").post(createDelivery);
router
  .route("/delivery/:id")
  .get(getDeliveryDetails)
  .put(updateDelivery)
  .delete(isAuthenticatedUser, deleteDelivery);

module.exports = router;
