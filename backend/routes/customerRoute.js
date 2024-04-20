const express = require("express");
const {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDetails,
  getCustomerDeliveryHistory,
  getAllCustomersBasicDetails,
  getAllCustomersNameId,
  getCustomersByNextDeliveryDate,
  getCustomerDetailsForTrips,
  getCustomersByNextDeliveryDateMore,
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
router
  .route("/customerspredictionsmore/")
  .get(isAuthenticatedUser, getCustomersByNextDeliveryDateMore);
router.route("/customer/new").post(isAuthenticatedUser, createCustomer);
router
  .route("/customerForTrips/:customerId")
  .get(isAuthenticatedUser, getCustomerDetailsForTrips);
router
  .route("/customer/:customerId")
  .put(isAuthenticatedUser, updateCustomer)
  .delete(isAuthenticatedUser, authorizedroles("admin"), deleteCustomer)
  .get(isAuthenticatedUser, getCustomerDetails);

router
  .route("/getdeliveriesdetails/:customerId")
  .get(isAuthenticatedUser, getCustomerDeliveryHistory);

module.exports = router;
