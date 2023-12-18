const Payment = require("../models/paymentSchema");
const Customer = require("../models/customerModel");
const Delivery = require("../models/deliverySchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const Expenses = require("../models/expenseSchema");

exports.generateDailyReport = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;
  const inputDate = date ? new Date(date) : new Date() + 5.5 * 60 * 60 * 1000;
  const reportDate = new Date(
    inputDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const reportStartDate = new Date(reportDate);
  reportStartDate.setHours(0, 0, 0, 0);
  const reportEndDate = new Date(reportDate);
  reportEndDate.setHours(23, 59, 59, 999);

  // Fetch relevant data from the database
  const customers = await Customer.find();
  const deliveries = await Delivery.find({
    deliveryDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const payments = await Payment.find({
    paymentDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const newConnections = await Customer.countDocuments({
    createdAt: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const expenses = await Expenses.find({
    expenseDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  // Perform aggregations using JavaScript
  const totalCansDelivered = deliveries.reduce(
    (total, delivery) => total + (delivery.deliveredQuantity || 0),
    0
  );

  const totalReceivedCans = deliveries.reduce(
    (total, delivery) => total + (delivery.returnedJars || 0),
    0
  );

  const totalSales = deliveries.reduce((total, delivery) => {
    const customer = customers.find(
      (c) => c.customerId.toString() === delivery?.customer?.toString()
    );
    if (customer) {
      return total + (delivery.deliveredQuantity || 0) * (customer.rate || 0);
    }
    return total;
  }, 0);

  const totalCashReceived = payments
    .filter((payment) => payment.paymentMode.toLowerCase() === "cash")
    .reduce((total, payment) => total + payment.amount, 0);

  const totalOnlineReceived = payments
    .filter((payment) => payment.paymentMode.toLowerCase() === "online")
    .reduce((total, payment) => total + payment.amount, 0);

  //daily expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Prepare the final report object
  const dailyReport = {
    reportDate,
    totalCansDelivered,
    totalReceivedCans,
    totalSales,
    totalCashReceived,
    totalOnlineReceived,
    newConnections,
    totalExpenses,
  };

  res.status(200).json({ success: true, report: dailyReport });
});

exports.generateMonthlyReport = catchAsyncError(async (req, res, next) => {
  const { monthYear } = req.params;
  console.log(monthYear);
  const [year, month] = monthYear.split("-");

  const reportStartDate = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0)
  );

  // Calculate the last day of the month
  const lastDayOfMonth = new Date(
    Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999)
  );
  const reportEndDate = new Date(lastDayOfMonth);

  console.log(reportStartDate, reportEndDate);
  // Fetch relevant data from the database
  const customers = await Customer.find();
  const deliveries = await Delivery.find({
    deliveryDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const payments = await Payment.find({
    paymentDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const newConnections = await Customer.countDocuments({
    createdAt: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  const expenses = await Expenses.find({
    expenseDate: {
      $gte: reportStartDate,
      $lte: reportEndDate,
    },
  });

  // Perform aggregations using JavaScript
  const totalCansDelivered = deliveries.reduce(
    (total, delivery) => total + (delivery.deliveredQuantity || 0),
    0
  );

  const totalReceivedCans = deliveries.reduce(
    (total, delivery) => total + (delivery.returnedJars || 0),
    0
  );

  const totalSales = deliveries.reduce((total, delivery) => {
    const customer = customers.find(
      (c) => c.customerId.toString() === delivery?.customer?.toString()
    );
    if (customer) {
      return total + (delivery.deliveredQuantity || 0) * (customer.rate || 0);
    }
    return total;
  }, 0);

  const totalCashReceived = payments
    .filter((payment) => payment.paymentMode.toLowerCase() === "cash")
    .reduce((total, payment) => total + payment.amount, 0);

  const totalOnlineReceived = payments
    .filter((payment) => payment.paymentMode.toLowerCase() === "online")
    .reduce((total, payment) => total + payment.amount, 0);

  //daily expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Prepare the final report object
  const monthlyReport = {
    month,
    year,
    totalCansDelivered,
    totalReceivedCans,
    totalSales,
    totalCashReceived,
    totalOnlineReceived,
    newConnections,
    totalExpenses,
  };

  res.status(200).json({ success: true, report: monthlyReport });
});
