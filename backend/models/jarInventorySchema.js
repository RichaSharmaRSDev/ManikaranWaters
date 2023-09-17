const mongoose = require("mongoose");

const jarInventorySchema = mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    required: true,
  },
  morning: {
    emptyJars: {
      type: Number,
      required: true,
    },
    filledJars: {
      type: Number,
      required: true,
    },
  },
  trips: [
    {
      tripNumber: {
        type: Number,
      },
      associateName: {
        type: String,
      },
      filledJarsTaken: {
        type: Number,
      },
      filledJarsBrought: {
        type: Number,
      },
      emptyJarsTaken: {
        type: Number,
      },
      emptyJarsBrought: {
        type: Number,
      },
    },
  ],
  endOfDay: {
    emptyJars: {
      type: Number,
    },
    filledJars: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("JarInventory", jarInventorySchema);
