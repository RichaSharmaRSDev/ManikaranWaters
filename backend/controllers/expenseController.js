const Expense = require("../models/expenseSchema");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createExpense = catchAsyncError(async (req, res, next) => {
  const {
    expenseDate = Date.now() + 5.5 * 60 * 60 * 100,
    category,
    amount,
  } = req.body;

  const expense = await Expense.create({
    expenseDate,
    category,
    amount,
  });

  res.status(201).json({ success: true, expense });
});

exports.getExpensesForDate = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;
  const reportDate = date
    ? new Date(date) + 5.5 * 60 * 60 * 1000
    : Date.now() + 5.5 * 60 * 60 * 1000;

  // Set the start and end of the selected date
  const startDate = new Date(reportDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(reportDate);
  endDate.setHours(23, 59, 59, 999);

  // Retrieve expenses for the selected date
  const expenses = await Expense.find({
    expenseDate: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  res.status(200).json({ success: true, expenses });
});
