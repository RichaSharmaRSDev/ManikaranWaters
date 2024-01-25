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
});

module.exports = mongoose.model("Trips", tripsSchema);
