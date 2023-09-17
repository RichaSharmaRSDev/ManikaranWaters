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
  const resultsPerPage = 20;
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
  const resultsPerPage = 20;
  const customerCount = await Customer.countDocuments();
  const apiFeature = new ApiFeatures(
    Customer.find().select("-deliveries -payments -createdAt -zone"),
    req.query
  )
    .search()
    .filter()
    .pagination(resultsPerPage);
  const customers = await apiFeature.query;
  const customerFeatureCount = customers.length;

  res.status(200).json({
    success: true,
    customers,
    customerCount,
    customerFeatureCount,
  });
});

//get all customers name and Id
exports.getAllCustomersNameId = catchAsyncError(async (req, res) => {
  const apiFeature = new ApiFeatures(
    Customer.find().select("customerId name -_id"),
    req.query
  );
  const customers = await apiFeature.query;

  res.status(200).json({
    success: true,
    customers,
  });
});

//get all customers by NextDelivery date
exports.getCustomersByNextDeliveryDate = catchAsyncError(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ success: false, message: "Date parameter is required" });
  }

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const apiFeature = new ApiFeatures(
    Customer.find({
      nextDelivery: { $gte: startDate, $lte: endDate },
    }).select("-deliveries -payments -createdAt"),
    req.query
  ).pagination(20);

  const customers = await apiFeature.query;

  // const customers = await Customer.find({
  //   nextDelivery: { $gte: startDate, $lte: endDate },
  // }).select("-deliveries -payments -createdAt");

  const customerCount = customers.length;

  res.status(200).json({
    success: true,
    customers,
    customerCount,
  });
});

// exports.getCustomersByNextDeliveryDate = catchAsyncError(async (req, res) => {
//   const { date } = req.query;
//   console.log("test1", date);

//   if (!date) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Date parameter is required" });
//   }

//   const startDate = new Date(date);
//   const endDate = new Date(date);
//   endDate.setHours(23, 59, 59, 999);

//   // Create an instance of ApiFeatures for customers
//   const resultsPerPage = 20;
//   console.log("test2", startDate, endDate, req.query);

//   const apiFeature = new ApiFeatures(
//     Customer.find({
//       nextDelivery: { $gte: startDate, $lte: endDate },
//     }).select("-deliveries -payments -createdAt"),
//     req.query
//   )
//     .search()
//     .filter()
//     .pagination(resultsPerPage);

//   // Retrieve the filtered and paginated customers
//   const customers = await apiFeature.query;

//   res.status(200).json({
//     success: true,
//     customers,
//     customerCount: customers.length,
//   });
// });

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
