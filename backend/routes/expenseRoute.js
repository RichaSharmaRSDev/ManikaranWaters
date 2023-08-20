const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createExpense,
  getExpensesForDate,
} = require("../controllers/expenseController");

const router = express.Router();

router.route("/expense/new").post(isAuthenticatedUser, createExpense);
router.route("/expense/:date?").get(isAuthenticatedUser, getExpensesForDate);

module.exports = router;
