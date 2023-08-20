const express = require("express");
const {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDetails,
} = require("../controllers/customerController");
const { isAuthenticatedUser, authorizedroles } = require("../middleware/auth");

const router = express.Router();

router.route("/customers").get(isAuthenticatedUser, getAllCustomers);
router.route("/customer/new").post(isAuthenticatedUser, createCustomer);
router
  .route("/customer/:customerId")
  .put(isAuthenticatedUser, updateCustomer)
  .delete(isAuthenticatedUser, authorizedroles("admin"), deleteCustomer)
  .get(isAuthenticatedUser, getCustomerDetails);

module.exports = router;
