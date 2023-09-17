const Payment = require("../models/paymentSchema");
const Customer = require("../models/customerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

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

exports.getPaymentsForDay = catchAsyncError(async (req, res) => {
  const resultsPerPage = 20;
  const apiFeature = new ApiFeatures(Payment.find(), req.query)
    .filter()
    .pagination(resultsPerPage);
  if (req.query.paymentDate) {
    const startDate = new Date(req.query.paymentDate);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    endDate.setTime(endDate.getTime() + 5.5 * 60 * 60 * 1000);
    apiFeature.query = apiFeature.query
      .where("paymentDate")
      .gte(startDate)
      .lt(endDate);
  }

  const payments = await apiFeature.query;

  // Map through each payment and retrieve customer details
  const paymentsWithCustomerDetails = await Promise.all(
    payments.map(async (payment) => {
      try {
        const customer = await Customer.findOne({
          customerId: payment.customer,
        });
        console.log(customer);

        if (!customer) {
          throw new Error("Customer not found");
        }

        return {
          ...payment.toObject(),
          name: customer.name,
        };
      } catch (error) {
        console.error("Error retrieving customer details:", error);
        return payment.toObject();
      }
    })
  );

  //get totalpayment , payment in cash and payment online
  const totalPaymentReceived = payments.reduce((accumulator, payment) => {
    if (typeof payment.amount === "number") {
      return accumulator + payment.amount;
    }
    return accumulator;
  }, 0);
  const calculateCashPayment = (payments) => {
    return payments.reduce((accumulator, payment) => {
      if (
        payment.paymentMode === "cash" &&
        typeof payment.amount === "number"
      ) {
        return accumulator + payment.amount;
      }
      return accumulator;
    }, 0);
  };
  const calculateOnlinePayment = (payments) => {
    return payments.reduce((accumulator, payment) => {
      if (
        payment.paymentMode === "online" &&
        typeof payment.amount === "number"
      ) {
        return accumulator + payment.amount;
      }
      return accumulator;
    }, 0);
  };

  const finalPaymentTotal = {
    totalPaymentReceived: totalPaymentReceived,
    totalCashPayment: calculateCashPayment(payments),
    totalOnlinePayment: calculateOnlinePayment(payments),
  };

  res.status(200).json({
    success: true,
    payments: paymentsWithCustomerDetails,
    paymentCount: paymentsWithCustomerDetails.length,
    paymentTotal: finalPaymentTotal,
  });
});
