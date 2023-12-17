const JarInventory = require("../models/jarInventorySchema");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create a new inventory record for the day
exports.createInventoryRecord = catchAsyncError(async (req, res, next) => {
  const { date, morning, trips, endOfDay } = req.body;

  const inventoryRecord = await JarInventory.create({
    date,
    morning,
    trips,
    endOfDay,
  });

  res.status(201).json({ success: true, inventoryRecord });
});

// Update an existing inventory record for the day
exports.updateInventoryRecord = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;
  const { morning, trips, endOfDay } = req.body;

  const existingRecord = await JarInventory.findOne({ date });

  if (!existingRecord) {
    return next(new ErrorHandler("Inventory record not found", 404));
  }

  // Update the existing record with the new data
  existingRecord.morning = morning;
  existingRecord.trips = trips;
  existingRecord.endOfDay = endOfDay;

  await existingRecord.save();

  res.status(200).json({ success: true, updatedRecord: existingRecord });
});

// Get inventory record for a specific date
exports.getInventoryRecord = catchAsyncError(async (req, res, next) => {
  const { date } = req.params;

  const inventoryRecord = await JarInventory.findOne({ date });

  if (!inventoryRecord) {
    return next(new ErrorHandler("Inventory record not found", 404));
  }

  res.status(200).json({ success: true, inventoryRecord });
});

// Get inventory record for a specific month
exports.getInventoryRecordMonth = catchAsyncError(async (req, res, next) => {
  const { month } = req.params;

  const year = new Date(Date.now()).getFullYear();
  // Create a start date for the month
  const startDate = new Date(`${year}-${month}-01T00:00:00Z`);

  // Calculate the end date for the month
  let endDate;
  if (month == 12) {
    endDate = new Date(`${year}-12-31T23:59:59Z`);
  } else {
    const nextMonth = parseInt(month, 10) + 1;
    endDate = new Date(`${year}-${nextMonth}-01T00:00:00Z`);
  }

  // Query for records within the specified month
  const inventoryRecords = await JarInventory.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  if (!inventoryRecords) {
    return next(
      new ErrorHandler(
        "No inventory records found for the specified month",
        404
      )
    );
  }

  /*Calculate differences for each day and each trip*/
  let tillDateDifference = 0;
  let highestTripCount = 0;
  const recordsWithDifferences = inventoryRecords.map((record) => {
    // Calculate morning and endOfDay differences
    const morningTotal = record.morning.filledJars + record.morning.emptyJars;
    const endOfDayTotal =
      record.endOfDay.filledJars + record.endOfDay.emptyJars;
    const dayDifference = endOfDayTotal - morningTotal;
    // Calculate differences for each trip
    const tripsWithDifference = record.trips.map((trip) => {
      const tripTakenTotal = trip.filledJarsTaken + trip.emptyJarsTaken;
      const tripBroughtTotal = trip.filledJarsBrought + trip.emptyJarsBrought;
      const tripDifference = tripBroughtTotal - tripTakenTotal;

      return {
        ...trip.toObject(),
        difference: tripDifference,
      };
    });

    // Check if this day has the highest trip count
    const dayTripCount = tripsWithDifference.length;
    if (dayTripCount > highestTripCount) {
      highestTripCount = dayTripCount;
    }

    //Cumlative jar count at end of all day
    tillDateDifference += dayDifference;

    return {
      ...record.toObject(),
      dayDifference: dayDifference,
      tillDateDifference: tillDateDifference,
      trips: tripsWithDifference,
    };
  });

  res.status(200).json({
    success: true,
    inventoryRecords: recordsWithDifferences,
    highestTripCount: highestTripCount,
  });
});
