const express = require("express");
const {
  getAllDeliveries,
  createDelivery,
  getDeliveryDetails,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/deliveries").get(getAllDeliveries);
router.route("/delivery/new").post(createDelivery);
router
  .route("/delivery/:id")
  .get(getDeliveryDetails)
  .put(updateDelivery)
  .delete(isAuthenticatedUser, deleteDelivery);

module.exports = router;
