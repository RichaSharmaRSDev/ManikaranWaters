const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
  customer: {
    type: String,
    ref: "Customer",
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  deliveryAssociateName: {
    type: String,
  },
  deliveredQuantity: {
    type: Number,
  },
  returnedJars: {
    type: Number,
  },
  amountReceived: {
    type: Number,
  },
  paymentMode: {
    type: String,
  },
  deliveryComment: {
    type: String,
  },
});

module.exports = mongoose.model("Delivery", deliverySchema);
