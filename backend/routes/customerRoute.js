const express = require("express");
const {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDetails,
  getAllCustomersBasicDetails,
  getAllCustomersNameId,
  getCustomersByNextDeliveryDate,
  getCustomerDetailsForTrips,
} = require("../controllers/customerController");
const { isAuthenticatedUser, authorizedroles } = require("../middleware/auth");

const router = express.Router();

router.route("/customers").get(isAuthenticatedUser, getAllCustomers);
router
  .route("/customersbasic")
  .get(isAuthenticatedUser, getAllCustomersBasicDetails);
router
  .route("/customersidname")
  .get(isAuthenticatedUser, getAllCustomersNameId);
router
  .route("/customerspredictions/")
  .get(isAuthenticatedUser, getCustomersByNextDeliveryDate);
router.route("/customer/new").post(isAuthenticatedUser, createCustomer);
router
  .route("/customerForTrips/:customerId")
  .get(isAuthenticatedUser, getCustomerDetailsForTrips);
router
  .route("/customer/:customerId")
  .put(isAuthenticatedUser, updateCustomer)
  .delete(isAuthenticatedUser, authorizedroles("admin"), deleteCustomer)
  .get(isAuthenticatedUser, getCustomerDetails);

module.exports = router;
