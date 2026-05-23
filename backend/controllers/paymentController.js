const Payment = require("../models/paymentSchema");
const Customer = require("../models/customerModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createPayment = catchAsyncError(async (req, res, next) => {
  const {
    customerId,
    paymentDate = Date.now(),
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
  customer.lastUpdated = Date.now();

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
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(req.query.paymentDate);
    endDate.setHours(23, 59, 59, 999);
    apiFeature.query = apiFeature.query
      .where("paymentDate")
      .gte(startDate)
      .lt(endDate);
  }

  const payments = await apiFeature.query;

  const countQuery = apiFeature.query.model.find(apiFeature.query._conditions);
  const paymentCount = await countQuery.countDocuments();

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

  // Aggregate totals across ALL matching records (not just current page)
  const [payTotals] = await Payment.aggregate([
    { $match: apiFeature.query._conditions },
    {
      $group: {
        _id: null,
        totalPaymentReceived: { $sum: "$amount" },
        totalCashPayment: {
          $sum: { $cond: [{ $eq: ["$paymentMode", "cash"] }, "$amount", 0] },
        },
        totalOnlinePayment: {
          $sum: { $cond: [{ $eq: ["$paymentMode", "online"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const finalPaymentTotal = {
    totalPaymentReceived: payTotals?.totalPaymentReceived || 0,
    totalCashPayment: payTotals?.totalCashPayment || 0,
    totalOnlinePayment: payTotals?.totalOnlinePayment || 0,
  };

  res.status(200).json({
    success: true,
    payments: paymentsWithCustomerDetails,
    paymentCount,
    paymentTotal: finalPaymentTotal,
  });
});

exports.getPaymentsForRange = catchAsyncError(async (req, res) => {
  const resultsPerPage = 20;
  const apiFeature = new ApiFeatures(Payment.find(), req.query).filter();

  if (req.query.paymentStartDate && req.query.paymentEndDate) {
    const startDate = new Date(req.query.paymentStartDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(req.query.paymentEndDate);
    endDate.setHours(23, 59, 59, 999);
    apiFeature.query = apiFeature.query
      .where("paymentDate")
      .gte(startDate)
      .lte(endDate);
  }

  // Count the total number of payments matching the filter criteria
  const paymentCount = await Payment.countDocuments(
    apiFeature.query._conditions
  );

  // Apply pagination
  apiFeature.pagination(resultsPerPage);

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

  // Aggregate totals across ALL matching records (not just current page)
  const [payTotalsRange] = await Payment.aggregate([
    { $match: apiFeature.query._conditions },
    {
      $group: {
        _id: null,
        totalPaymentReceived: { $sum: "$amount" },
        totalCashPayment: {
          $sum: { $cond: [{ $eq: ["$paymentMode", "cash"] }, "$amount", 0] },
        },
        totalOnlinePayment: {
          $sum: { $cond: [{ $eq: ["$paymentMode", "online"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const finalPaymentTotal = {
    totalPaymentReceived: payTotalsRange?.totalPaymentReceived || 0,
    totalCashPayment: payTotalsRange?.totalCashPayment || 0,
    totalOnlinePayment: payTotalsRange?.totalOnlinePayment || 0,
  };

  res.status(200).json({
    success: true,
    payments: paymentsWithCustomerDetails,
    paymentCount,
    paymentTotal: finalPaymentTotal,
  });
});

exports.deletePayment = catchAsyncError(async (req, res, next) => {
  const { customerId, paymentId } = req.params;

  try {
    // Find the customer by customerId
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // Find the payment to delete by paymentId
    const paymentToDelete = await Payment.findById(paymentId);

    if (!paymentToDelete) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    console.log(customerId);
    // Check if the payment belongs to the customer
    if (paymentToDelete.customer !== customerId) {
      return res.status(403).json({
        success: false,
        message: "This payment does not belong to the specified customer",
      });
    }

    // Delete the payment
    await Payment.findByIdAndDelete(paymentId);

    // Update remaining amount
    customer.paidAmount -= paymentToDelete.amount;
    customer.remainingAmount = customer.billedAmount - customer.paidAmount;

    // Save updated customer details
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully, customer data updated.",
    });
  } catch (error) {
    console.error(
      "Error deleting payment or updating customer:",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});
