const Payment = require("../models/paymentSchema");
const Customer = require("../models/customerModel");
const Delivery = require("../models/deliverySchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const Expenses = require("../models/expenseSchema");

exports.generateDailyReport = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;
  // TZ is set to Asia/Kolkata in server.js so new Date() and setHours() are IST-aware
  const reportDate = date ? new Date(date) : new Date();
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
  const [year, month] = monthYear.split("-");

  // Use local time (IST) so month boundaries align with IST midnight
  const reportStartDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  reportStartDate.setHours(0, 0, 0, 0);
  const reportEndDate = new Date(parseInt(year), parseInt(month), 0);
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

  // Perform aggregations for whole month
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

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // prepare individual day's data
  const dailyIndividualReport = {};
  deliveries.forEach((delivery) => {
    const d = new Date(delivery.deliveryDate);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!dailyIndividualReport[dateKey]) {
      dailyIndividualReport[dateKey] = {
        delivered: 0,
        returned: 0,
        cash: 0,
        online: 0,
        totalAmount: 0,
        expenses: 0,
        revenue: 0,
        newConnections: 0,
      };
    }
    if (delivery.deliveredQuantity > 0) {
      dailyIndividualReport[dateKey].delivered += delivery.deliveredQuantity;

      const customer = customers.find(
        (c) => c.customerId.toString() === delivery?.customer?.toString()
      );
      if (customer) {
        dailyIndividualReport[dateKey].revenue +=
          delivery.deliveredQuantity * (customer.rate || 0);
      }
    }
    if (delivery.returnedJars > 0) {
      dailyIndividualReport[dateKey].returned += delivery.returnedJars;
    }
  });
  payments.forEach((payment) => {
    const p = new Date(payment.paymentDate);
    const dateKey = `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, "0")}-${String(p.getDate()).padStart(2, "0")}`;
    if (!dailyIndividualReport[dateKey]) {
      dailyIndividualReport[dateKey] = {
        delivered: 0,
        received: 0,
        cash: 0,
        online: 0,
        totalAmount: 0,
        expenses: 0,
        revenue: 0,
        newConnections: 0,
      };
    }
    if (payment.amount > 0) {
      if (payment.paymentMode === "cash") {
        dailyIndividualReport[dateKey].cash += payment.amount;
      } else {
        dailyIndividualReport[dateKey].online += payment.amount;
      }
      dailyIndividualReport[dateKey].totalAmount += payment.amount;
    }
  });

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
    dailyIndividualReport,
  };

  res.status(200).json({ success: true, report: monthlyReport });
});

exports.generateGrowthReport = catchAsyncError(async (req, res, next) => {
  const { months, from, to } = req.query;
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const monthList = [];

  if (from && to) {
    const [fromYear, fromMonth] = from.split('-').map(Number);
    const [toYear, toMonth] = to.split('-').map(Number);
    let y = fromYear, m = fromMonth;
    while (y < toYear || (y === toYear && m <= toMonth)) {
      monthList.push({ year: y, month: m });
      m++;
      if (m > 12) { m = 1; y++; }
    }
  } else {
    const n = parseInt(months) || 6;
    const now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    for (let i = 0; i < n; i++) {
      monthList.unshift({ year: y, month: m });
      m--;
      if (m < 1) { m = 12; y--; }
    }
  }

  const allCustomers = await Customer.find().select('customerId rate');
  const rateMap = {};
  allCustomers.forEach(c => { rateMap[c.customerId] = c.rate || 0; });

  const data = await Promise.all(monthList.map(async ({ year, month }) => {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const [deliveries, payments, connections] = await Promise.all([
      Delivery.find({ deliveryDate: { $gte: startDate, $lte: endDate } }).select('customer deliveredQuantity returnedJars'),
      Payment.find({ paymentDate: { $gte: startDate, $lte: endDate } }).select('amount paymentMode'),
      Customer.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    ]);

    let revenue = 0, cans = 0, returned = 0;
    deliveries.forEach(d => {
      const qty = d.deliveredQuantity || 0;
      cans += qty;
      returned += d.returnedJars || 0;
      revenue += qty * (rateMap[d.customer] || 0);
    });

    let cash = 0, online = 0;
    payments.forEach(p => {
      if (p.paymentMode === 'cash') cash += p.amount;
      else online += p.amount;
    });

    return {
      month: `${MONTH_NAMES[month - 1]} ${String(year).slice(-2)}`,
      revenue,
      cash,
      online,
      cans,
      returned,
      connections,
    };
  }));

  res.status(200).json({ success: true, data });
});

exports.generateDetailedMonthlyReport = catchAsyncError(
  async (req, res, next) => {
    const { monthYear } = req.params;
    const [year, month] = monthYear.split("-");

    // Use local time (IST) so month boundaries align with IST midnight
    const reportStartDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    reportStartDate.setHours(0, 0, 0, 0);
    const reportEndDate = new Date(parseInt(year), parseInt(month), 0);
    reportEndDate.setHours(23, 59, 59, 999);

    // Fetch relevant data from the database
    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: reportStartDate,
        $lte: reportEndDate,
      },
    });

    const customerIds = [
      ...new Set(deliveries.map((delivery) => delivery.customer)),
    ];

    const customersList = await Customer.find({
      customerId: { $in: customerIds },
    })
      .select("customerId name remainingAmount -_id")
      .sort("-remainingAmount");

    const detailedMonthlyReport = {
      customersList,
    };
    res.status(200).json({ success: true, report: detailedMonthlyReport });
  }
);
