const Expense = require("../models/expenseSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createExpense = catchAsyncError(async (req, res, next) => {
  const {
    expenseDate = Date.now() + 5.5 * 60 * 60 * 100,
    category,
    amount,
    description,
  } = req.body;

  const newExpense = await Expense.create({
    expenseDate,
    category,
    amount,
    description,
  });

  res.status(201).json({ success: true, newExpense });
});

exports.getExpensesForDate = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;
  const reportDate = date
    ? new Date(date) // + 5.5 * 60 * 60 * 1000
    : Date.now() + 5.5 * 60 * 60 * 1000;

  // Set the start and end of the selected date
  const startDate = new Date(reportDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(reportDate);
  endDate.setHours(23, 59, 59, 999);

  const resultsPerPage = 20;
  const apiFeature = new ApiFeatures(
    Expense.find({
      expenseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }),
    req.query
  )
    .search()
    .filter()
    .pagination(resultsPerPage);

  // Retrieve the expenses using the configured apiFeature
  const expenses = await apiFeature.query;
  const expenseCount = expenses.length;
  // Calculate the total amount for the expenses on the selected date
  const totalAmount = expenses.reduce((accumulator, expense) => {
    return accumulator + expense.amount;
  }, 0);

  res.status(200).json({ success: true, expenses, expenseCount, totalAmount });
});
