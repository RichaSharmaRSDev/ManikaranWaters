const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  customer: {
    type: String,
    ref: "Customer",
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
