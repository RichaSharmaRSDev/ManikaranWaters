const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");

const {
  createTrip,
  editTrip,
  getTripsByDate,
  overwriteTrip,
  getTripsByDateAndDeliveryGuy,
} = require("../controllers/tripsController");

const router = express.Router();

router.route("/trip/new").post(isAuthenticatedUser, createTrip);
router.route("/trip/:tripNumber/:tripDate").put(isAuthenticatedUser, editTrip);
router
  .route("/trips/overwrite-trip/:tripNumber/:tripDate")
  .put(isAuthenticatedUser, overwriteTrip);
router.route("/trips/:date").get(isAuthenticatedUser, getTripsByDate);
router
  .route("/trips/:date/:deliveryGuyName")
  .get(isAuthenticatedUser, getTripsByDateAndDeliveryGuy);

module.exports = router;
