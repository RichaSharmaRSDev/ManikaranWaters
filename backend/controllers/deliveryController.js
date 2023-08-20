const Delivery = require("../models/deliverySchema");
const Customer = require("../models/customerModel");
const Payment = require("../models/paymentSchema");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createDelivery = catchAsyncError(async (req, res, next) => {
  const {
    customerId,
    deliveredQuantity = 0,
    deliveryDate: requestedDeliveryDate,
    returnedJars,
    amountReceived,
    paymentMode,
  } = req.body;

  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  let finalDeliveryDate;

  if (requestedDeliveryDate) {
    finalDeliveryDate = new Date(requestedDeliveryDate);
  } else {
    finalDeliveryDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000); // Set delivery date to today's date
  }

  const delivery = await Delivery.create({
    customer: customerId,
    deliveryDate: finalDeliveryDate,
    deliveredQuantity,
    returnedJars,
    amountReceived,
    paymentMode,
  });
  let payment;
  if (amountReceived && paymentMode) {
    payment = await Payment.create({
      customer: customerId,
      paymentDate: finalDeliveryDate,
      amount: amountReceived,
      paymentMode,
    });
  }

  // Update the lastDeliveryDate for the associated customer
  customer.lastDeliveryDate = finalDeliveryDate;

  // Add the delivery details to the deliveries array in the customer document
  customer.deliveries.push({
    deliveryDate: finalDeliveryDate,
    deliveredQuantity,
    returnedJars,
    amountReceived,
    paymentMode,
  });
  customer.deliveries.sort((a, b) => a.deliveryDate - b.deliveryDate);

  if (amountReceived && paymentMode) {
    customer.payments.push({
      paymentDate: finalDeliveryDate,
      amount: amountReceived,
      paymentMode,
    });
  }
  // Update currentJars and extraJars based on deliveries
  const totalDeliveredQuantity = customer.deliveries.reduce(
    (total, delivery) => total + delivery.deliveredQuantity,
    0
  );
  customer.currentJars = totalDeliveredQuantity - (delivery.returnedJars || 0);
  customer.extraJars = customer.currentJars - customer.allotment;
  customer.lastUpdated = Date.now() + 5.5 * 60 * 60 * 1000;

  await customer.save();

  res.status(201).json({ success: true, delivery, payment });
});

exports.getAllDeliveries = catchAsyncError(async (req, res) => {
  const resultsPerPage = 10;
  const apiFeature = new ApiFeatures(Delivery.find(), req.query)
    .filter()
    .pagination(resultsPerPage);
  const deliveries = await apiFeature.query;

  res.status(200).json({
    success: true,
    deliveries,
  });
});

exports.getDeliveryDetails = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  res.status(200).json({
    success: true,
    delivery,
  });
});

exports.updateDelivery = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  res.status(200).json({
    success: true,
    delivery,
  });
});

exports.deleteDelivery = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  await delivery.deleteOne();

  res.status(200).json({
    success: true,
    message: "Delivery Deleted Successfully",
  });
});
