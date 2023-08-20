const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
  customer: {
    type: String,
    ref: "Customer",
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  deliveredQuantity: {
    type: Number,
  },
  returnedJars: {
    type: Number,
  },
  amountReceived: {
    type: Number,
    default: 0,
  },
});
deliverySchema.pre("save", async function (next) {
  // Before saving a new delivery, update the last delivery date in the associated customer document
  const Customer = mongoose.model("Customer");

  const customer = await Customer.findOne({ customerId: this.customer });

  if (!customer) {
    return next(new Error("Customer not found"));
  }

  // Find and update the latest delivery date from the deliveries array
  const latestDelivery = customer.deliveries.reduce((latest, delivery) => {
    return delivery.deliveryDate > latest ? delivery.deliveryDate : latest;
  }, new Date(0));
  customer.lastDeliveryDate = latestDelivery;

  //Update the billedAmount
  const billedAmount =
    customer.billedAmount + customer.rate * this.deliveredQuantity;
  customer.billedAmount = billedAmount;

  //Update paid Amount
  const paidAmount = customer.paidAmount + this.amountReceived;
  customer.paidAmount = paidAmount;

  //Update Remaining Amount
  const remainingAmount = (billedAmount || 0) - (paidAmount || 0);
  customer.remainingAmount = remainingAmount;

  await customer.save();
  next();
});

module.exports = mongoose.model("Delivery", deliverySchema);
