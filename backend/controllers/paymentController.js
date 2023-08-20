const Payment = require("../models/paymentSchema");
const Customer = require("../models/customerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createPayment = catchAsyncError(async (req, res, next) => {
  const {
    customerId,
    paymentDate = Date.now() + 5.5 * 60 * 60 * 1000,
    amount,
    paymentMode,
  } = req.body;

  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  const payment = await Payment.create({
    customer: customerId,
    paymentDate,
    amount,
    paymentMode,
  });

  //Update paid Amount
  const paidAmount = customer.paidAmount + payment.amount;
  customer.paidAmount = paidAmount;

  //Update Remaining Amount
  const remainingAmount = (customer.billedAmount || 0) - (paidAmount || 0);
  customer.remainingAmount = remainingAmount;

  //update lastUpdated in customer
  customer.lastUpdated = Date.now() + 5.5 * 60 * 60 * 1000;

  // Add the delivery details to the deliveries array in the customer document
  customer.payments.push({
    paymentDate,
    amount,
    paymentMode,
  });

  await customer.save();

  res.status(201).json({ success: true, payment });
});
