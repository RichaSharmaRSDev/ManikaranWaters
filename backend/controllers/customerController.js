const Customer = require("../models/customerModel");
const Delivery = require("../models/deliverySchema");
const Payment = require("../models/paymentSchema");
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
    Customer.find()
      .select("-deliveries -payments -createdAt -zone")
      .sort({ name: 1 }),
    req.query
  )
    .search()
    .filter();
  const customersQuery = await apiFeature.query;
  const customerFeatureCount = customersQuery.length;

  const apiFeatureWithPagination = new ApiFeatures(
    Customer.find()
      .select("-deliveries -payments -createdAt -zone")
      .sort({ name: 1 }),
    req.query
  )
    .search()
    .filter()
    .pagination(resultsPerPage);

  const customers = await apiFeatureWithPagination.query;

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
    Customer.find().select("customerId name -_id").sort({ name: 1 }),
    req.query
  );
  const customers = await apiFeature.query;

  res.status(200).json({
    success: true,
    customers,
  });
});

// get all customers by NextDelivery date
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

  // Query customers with nextDelivery date within the specified range
  const customersQuery = Customer.find({
    $or: [
      { nextDelivery: { $gte: startDate, $lte: endDate } },
      { nextDelivery: { $lt: startDate } }, // Include customers with back-dated nextDeliveryDate
    ],
  })
    .select("-deliveries -payments -createdAt")
    .sort({ nextDelivery: -1, frequency: 1, zone: 1 });

  const apiFeature = new ApiFeatures(customersQuery, req.query).pagination(20);

  const customers = await apiFeature.query;
  const customerCount = await Customer.countDocuments({
    $or: [
      { nextDelivery: { $gte: startDate, $lte: endDate } },
      { nextDelivery: { $lt: startDate } }, // Include customers with back-dated nextDeliveryDate
    ],
  });

  res.status(200).json({
    success: true,
    customers,
    customerCount,
  });
});

// get all customers by NextDelivery date
exports.getCustomersByNextDeliveryDateMore = catchAsyncError(
  async (req, res) => {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date parameter is required" });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Query customers with nextDelivery date within the specified range
    const customersQuery = Customer.find({
      $or: [
        { nextDelivery: { $gte: startDate, $lte: endDate } },
        { nextDelivery: { $lt: startDate } }, // Include customers with back-dated nextDeliveryDate
      ],
    })
      .select("-deliveries -payments -createdAt")
      .sort({ nextDelivery: -1, frequency: 1, zone: 1 });

    const apiFeature = new ApiFeatures(customersQuery, req.query).pagination(
      50
    );

    const customers = await apiFeature.query;
    const customerCount = await Customer.countDocuments({
      $or: [
        { nextDelivery: { $gte: startDate, $lte: endDate } },
        { nextDelivery: { $lt: startDate } }, // Include customers with back-dated nextDeliveryDate
      ],
    });

    res.status(200).json({
      success: true,
      customers,
      customerCount,
    });
  }
);

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

// Get Customer's Delivery and Payments
exports.getCustomerDeliveryHistory = catchAsyncError(async (req, res, next) => {
  const customerId = req.params.customerId;
  const customerHistoryDeliveries = await Delivery.find({
    customer: customerId,
  });
  const customerHistoryPaymnets = await Payment.find({
    customer: customerId,
  });

  if (!customerId) {
    return next(new ErrorHandler("CustomerId not found", 404));
  }

  res.status(200).json({
    status: true,
    customerHistoryDeliveries,
    customerHistoryPaymnets,
  });
});

// Get Customer's Details For Trips
exports.getCustomerDetailsForTrips = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findOne({
    customerId: req.params.customerId,
  }).select("customerId name phoneNo address allotment -_id");

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  const { customerId, name, allotment, phoneNo, address } = customer;

  res.status(200).json({
    success: true,
    customer: {
      customerId,
      name,
      allotment,
      phoneNo,
      address,
    },
  });
});

// Update customer
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

// Delete Customer
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
