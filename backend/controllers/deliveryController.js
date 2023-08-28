const Delivery = require("../models/deliverySchema");
const Customer = require("../models/customerModel");
const Payment = require("../models/paymentSchema");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createDelivery = catchAsyncError(async (req, res, next) => {
  const {
    customerId,
    deliveredQuantity,
    deliveryDate,
    returnedJars,
    amountReceived,
    paymentMode,
  } = req.body;

  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  const delivery = await Delivery.create({
    customer: customerId,
    deliveryDate,
    deliveredQuantity,
    returnedJars,
    amountReceived,
    paymentMode,
  });

  // Add the delivery details to the deliveries array in the customer document
  customer.deliveries.push({
    deliveryDate: deliveryDate,
    deliveredQuantity,
    returnedJars,
    amountReceived,
    paymentMode,
  });
  customer.deliveries.sort((a, b) => a.deliveryDate - b.deliveryDate);
  // Update the lastDeliveryDate for the associated customer
  const latestDelivery = customer.deliveries.reduce((latest, delivery) => {
    return delivery.deliveryDate > latest ? delivery.deliveryDate : latest;
  }, new Date(0));
  customer.lastDeliveryDate = latestDelivery;

  //BilledAmount
  if (deliveredQuantity) {
    customer.billedAmount =
      customer.billedAmount + deliveredQuantity * customer.rate;
  }

  // Update currentJars and extraJars based on deliveries
  if (delivery.deliveredQuantity || delivery.returnedJars) {
    const totalDeliveredQuantity = customer.deliveries.reduce(
      (total, delivery) => total + (delivery.deliveredQuantity || 0),
      0
    );
    customer.currentJars =
      totalDeliveredQuantity - (delivery.returnedJars || 0);
    customer.extraJars = customer.currentJars - customer.allotment;
  }

  //updating payment too if they paid at time of delivery
  let payment;
  if (amountReceived && paymentMode) {
    payment = await Payment.create({
      customer: customerId,
      paymentDate: deliveryDate,
      amount: amountReceived,
      paymentMode,
    });

    customer.payments.push({
      paymentDate: deliveryDate,
      amount: amountReceived,
      paymentMode,
    });

    //Update paid Amount
    const paidAmount = customer.paidAmount + payment.amount;
    customer.paidAmount = paidAmount;

    //Update Remaining Amount
    const remainingAmount = (customer.billedAmount || 0) - (paidAmount || 0);
    customer.remainingAmount = remainingAmount;
  }

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
