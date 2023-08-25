const Customer = require("../models/customerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//create customer Details
exports.createCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ success: true, customer });
});

//get all customers all details
exports.getAllCustomers = catchAsyncError(async (req, res) => {
  const resultsPerPage = 15;
  const customerCount = await Customer.countDocuments();
  const apiFeature = new ApiFeatures(Customer.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  const customers = await apiFeature.query;

  res.status(200).json({
    success: true,
    customers,
    customerCount,
  });
});

//get all customers basic details
exports.getAllCustomersBasicDetails = catchAsyncError(async (req, res) => {
  const resultsPerPage = 15;
  const customerCount = await Customer.countDocuments();
  const apiFeature = new ApiFeatures(
    Customer.find().select("-deliveries -payments -createdAt"),
    req.query
  )
    .search()
    .filter()
    .pagination(resultsPerPage);
  const customers = await apiFeature.query;

  res.status(200).json({
    success: true,
    customers,
    customerCount,
  });
});

// Get Customer's Details
exports.getCustomerDetails = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findOne({
    customerId: req.params.customerId,
  });

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  res.status(200).json({
    success: true,
    customer,
  });
});

//Update customer
exports.updateCustomer = catchAsyncError(async (req, res, next) => {
  let customer = await Customer.findOne({
    customerId: req.params.customerId,
  });
  if (customer === null) {
    return next(new ErrorHandler("Customer not found", 404));
  }
  customer = await Customer.findOneAndUpdate(
    { customerId: req.params.customerId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  customer.lastUpdated = Date.now() + 5.5 * 60 * 60 * 1000;

  await customer.save();

  res.status(200).json({
    success: true,
    customer,
  });
});

exports.deleteCustomer = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findOne({
    customerId: req.params.customerId,
  });
  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }
  await customer.deleteOne();

  res.status(200).json({
    success: true,
    message: "Customer Deleted Successfully",
  });
});
