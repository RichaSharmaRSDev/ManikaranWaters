const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createInventoryRecord,
  updateInventoryRecord,
  getInventoryRecord,
  getInventoryRecordMonth,
} = require("../controllers/jarInventoryController");

const router = express.Router();
// Create a new inventory record for the day
router.route("/jarInventory").post(isAuthenticatedUser, createInventoryRecord);

// Update an existing inventory record for the day based on the date
router
  .route("/jarInventory/:date")
  .put(isAuthenticatedUser, updateInventoryRecord);

// Get inventory record for a specific date
router
  .route("/jarInventory/:date")
  .get(isAuthenticatedUser, getInventoryRecord);

// Get inventory record for a specific month
router
  .route("/jarInventory/month/:month")
  .get(isAuthenticatedUser, getInventoryRecordMonth);

module.exports = router;
