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

paymentSchema.index({ customer: 1 });
paymentSchema.index({ paymentDate: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
