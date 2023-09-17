const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
  expenseDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
