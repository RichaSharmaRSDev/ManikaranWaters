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

deliverySchema.index({ customer: 1 });
deliverySchema.index({ deliveryDate: 1 });
deliverySchema.index({ customer: 1, deliveryDate: -1 });

module.exports = mongoose.model("Delivery", deliverySchema);
