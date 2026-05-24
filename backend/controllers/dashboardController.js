const Delivery = require("../models/deliverySchema");
const Customer = require("../models/customerModel");
const Payment = require("../models/paymentSchema");
const Trip = require("../models/tripsSchema");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.generateDashboard = catchAsyncError(async (req, res, next) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = new Date(tomorrow);
  startOfTomorrow.setHours(0, 0, 0, 0);
  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfCurrentMonth.setHours(0, 0, 0, 0);

  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  startOfLastMonth.setHours(0, 0, 0, 0);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);

  const [
    todayDeliveries,
    todayPayments,
    allTripsToday,
    overdueCustomers,
    allCustomers,
    tomorrowCustomers,
    currentMonthPayments,
    lastMonthPayments,
  ] = await Promise.all([
    Delivery.find({ deliveryDate: { $gte: startOfDay, $lte: endOfDay } }),
    Payment.find({ paymentDate: { $gte: startOfDay, $lte: endOfDay } }),
    Trip.find({ tripDate: { $gte: startOfDay, $lte: endOfDay } }),
    Customer.find({ remainingAmount: { $gt: 0 } })
      .sort({ remainingAmount: -1 })
      .limit(5)
      .select("customerId name zone remainingAmount"),
    Customer.countDocuments({}),
    Customer.find({ nextDelivery: { $gte: startOfTomorrow, $lte: endOfTomorrow } })
      .select("customerId name zone nextDelivery"),
    Payment.find({ paymentDate: { $gte: startOfCurrentMonth, $lte: endOfDay } }),
    Payment.find({ paymentDate: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
  ]);

  const todayJarsDelivered = todayDeliveries.reduce(
    (sum, d) => sum + (d.deliveredQuantity || 0),
    0
  );
  const todayJarsReturned = todayDeliveries.reduce(
    (sum, d) => sum + (d.returnedJars || 0),
    0
  );
  const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const todayCash = todayPayments
    .filter((p) => p.paymentMode?.toLowerCase() === "cash")
    .reduce((sum, p) => sum + p.amount, 0);
  const todayOnline = todayPayments
    .filter((p) => p.paymentMode?.toLowerCase() === "online")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTripsToday = allTripsToday.length;
  const completedTripsToday = allTripsToday.filter((t) =>
    t.customers?.every((c) => c.isDelivered)
  ).length;

  const currentMonthRevenue = currentMonthPayments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const lastMonthRevenue = lastMonthPayments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const revenueChange =
    lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : null;

  res.status(200).json({
    success: true,
    today: {
      jarsDelivered: todayJarsDelivered,
      jarsReturned: todayJarsReturned,
      revenue: todayRevenue,
      cash: todayCash,
      online: todayOnline,
      deliveryCount: todayDeliveries.length,
      paymentCount: todayPayments.length,
    },
    trips: {
      total: totalTripsToday,
      completed: completedTripsToday,
      pending: totalTripsToday - completedTripsToday,
    },
    overdueCustomers,
    allCustomers,
    tomorrowCustomers,
    revenue: {
      currentMonth: currentMonthRevenue,
      lastMonth: lastMonthRevenue,
      changePercent: revenueChange !== null ? parseFloat(revenueChange.toFixed(2)) : null,
    },
  });
});
