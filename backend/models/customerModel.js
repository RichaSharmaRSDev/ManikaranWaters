const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Customer's Name"],
    },
    address: {
      type: String,
    },
    zone: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
      required: [true, "Please Enter Customer's Zone"],
    },
    customerId: {
      type: String,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: [true, "Please Enter Customer's Phone Number"],
    },
    customerType: {
      type: String,
      required: [true, "Please enter Customer Type"],
      enum: ["on demand", "subscription"],
    },
    frequency: {
      type: Number,
    },
    allotment: {
      type: Number,
      required: [true, "Please specify the number of jars given"],
    },
    rate: {
      type: Number,
      required: [true, "Please eneter water can rate"],
    },
    securityMoney: {
      type: Number,
      default: 0,
    },
    lastDeliveryDate: {
      type: Date,
      default: null,
    },
    billedAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    nextDelivery: {
      type: Date,
      default: function () {
        if (this.customerType === "subscription" && this.frequency) {
          const lastDelivery =
            this.lastDeliveryDate ||
            this.createdAt ||
            Date.now() + 5.5 * 60 * 60 * 1000;
          const nextDeliveryDate = new Date(lastDelivery);
          nextDeliveryDate.setDate(nextDeliveryDate.getDate() + this.frequency);
          return nextDeliveryDate;
        }
        return undefined; // Set nextDelivery to undefined for on demand customers
      },
    },
    currentJars: {
      type: Number,
      default: 0,
    },
    extraJars: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now() + 5.5 * 60 * 60 * 1000,
    },
    lastUpdated: {
      type: Date,
      default: Date.now() + 5.5 * 60 * 60 * 1000,
    },
    deliveries: [
      {
        deliveryDate: Date,
        deliveredQuantity: Number,
        returnedJars: Number,
        amountReceived: Number,
      },
    ],
    payments: [
      {
        paymentDate: Date,
        amount: String,
        paymentMode: String,
      },
    ],
  },
  {
    deliveries: { type: [], default: [] },
  }
);
customerSchema.pre("save", async function (next) {
  // Generate and set the customerId based on zone and a unique number
  if (!this.customerId) {
    const lastCustomer = await this.constructor
      .findOne({ zone: this.zone })
      .sort({ customerId: -1 });
    const lastNumber = lastCustomer
      ? parseInt(lastCustomer.customerId.slice(1))
      : 0;
    this.customerId = this.zone + (lastNumber + 1);
  }
  if (this.customerType === "subscription") {
    if (!this.frequency) {
      // Set default allotment, e.g., 1 day
      this.frequency = 1;
    }

    const lastDelivery =
      this.lastDeliveryDate ||
      this.createdAt ||
      Date.now() + 5.5 * 60 * 60 * 1000;
    const nextDeliveryDate = new Date(lastDelivery);
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + this.frequency);
    this.nextDelivery = nextDeliveryDate;
  } else {
    // Clear allotment and nextDelivery for on demand customers
    this.nextDelivery = undefined;
    this.frequency = undefined;
  }

  next();
});

module.exports = mongoose.model("Customer", customerSchema);
