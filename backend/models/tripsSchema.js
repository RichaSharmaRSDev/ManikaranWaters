const mongoose = require("mongoose");

const tripsSchema = mongoose.Schema({
  tripDate: {
    type: Date,
  },
  tripNumber: {
    type: String,
  },
  deliveryGuy: {
    type: String,
  },
  customers: {
    type: Array,
  },
  tripStatus: {
    type: String,
    enum: ["pending", "started", "ended"],
    default: "pending",
  },
  filledJarsTaken: {
    type: Number,
  },
  emptyJarsReturned: {
    type: Number,
  },
  filledJarsReturned: {
    type: Number,
  },
  tripStartedAt: {
    type: Date,
  },
  tripEndedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Trips", tripsSchema);
