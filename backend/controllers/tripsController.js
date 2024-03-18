const Trip = require("../models/tripsSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createTrip = catchAsyncError(async (req, res, next) => {
  const { tripDate, deliveryGuy, tripNumber, customers } = req.body;

  const newTrip = await Trip.create({
    tripDate,
    tripNumber,
    deliveryGuy,
    customers,
  });

  res.status(201).json({ success: true, newTrip });
});

exports.editTrip = async (req, res) => {
  try {
    const { tripDate, tripNumber, deliveryGuy, customers } = req.body;

    // Find the existing trip by tripNumber and tripDate
    const existingTrip = await Trip.findOne({ tripNumber, tripDate });

    if (!existingTrip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    // Update the trip details
    existingTrip.deliveryGuy = deliveryGuy;

    // Add new customer details to the customers array, avoiding duplicates
    customers.forEach((newCustomer) => {
      const isDuplicate = existingTrip.customers.some(
        (existingCustomer) =>
          existingCustomer.customerId === newCustomer.customerId
      );

      if (!isDuplicate) {
        existingTrip.customers.push(newCustomer);
      }
    });

    // Save the updated trip
    const updatedTrip = await existingTrip.save();

    res.status(200).json({ success: true, updatedTrip });
  } catch (error) {
    console.error("Error editing trip:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllTrips = catchAsyncError(async (req, res, next) => {
  const trips = await Trip.find();

  res.status(200).json({ success: true, trips });
});

exports.getTripsByDate = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const tripsByDate = await Trip.find({
    tripDate: { $gte: startDate, $lt: endDate },
  }).sort({ tripNumber: 1 });

  res.status(200).json({ success: true, tripsByDate });
});

exports.getTripsByDateAndDeliveryGuy = catchAsyncError(
  async (req, res, next) => {
    const { date, deliveryGuyName } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const tripsByDateAndDeliveryGuy = await Trip.find({
      tripDate: { $gte: startDate, $lt: endDate },
      deliveryGuy: deliveryGuyName,
    }).sort({ tripNumber: 1 });

    res.status(200).json({ success: true, tripsByDateAndDeliveryGuy });
  }
);

exports.overwriteTrip = async (req, res) => {
  try {
    const { tripDate, tripNumber, deliveryGuy, customers } = req.body;

    // Find the existing trip by tripNumber and tripDate
    const existingTrip = await Trip.findOne({ tripNumber, tripDate });

    // Update the trip details
    existingTrip.deliveryGuy = deliveryGuy;

    // Overwrite the customers array with the new set of customers
    existingTrip.customers = customers;

    // Save the updated trip
    const updatedTrip = await existingTrip.save();

    res.status(200).json({ success: true, updatedTrip });
  } catch (error) {
    console.error("Error overwriting trip:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
