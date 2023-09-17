const Delivery = require("../models/deliverySchema");
const Customer = require("../models/customerModel");
const Payment = require("../models/paymentSchema");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createDelivery = catchAsyncError(async (req, res, next) => {
  const {
    customerId,
    deliveredQuantity,
    deliveryDate,
    returnedJars,
    amountReceived,
    paymentMode,
    deliveryAssociateName,
  } = req.body;

  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  const delivery = await Delivery.create({
    customer: customerId,
    deliveryDate,
    deliveredQuantity,
    deliveryAssociateName,
    returnedJars,
    amountReceived,
    paymentMode,
  });

  // Add the delivery details to the deliveries array in the customer document
  customer.deliveries.push({
    deliveryDate: deliveryDate,
    deliveredQuantity,
    deliveryAssociateName,
    returnedJars,
    amountReceived,
    paymentMode,
  });
  customer.deliveries.sort((a, b) => a.deliveryDate - b.deliveryDate);
  // Update the lastDeliveryDate for the associated customer
  const latestDelivery = customer.deliveries.reduce((latest, delivery) => {
    return delivery.deliveryDate > latest ? delivery.deliveryDate : latest;
  }, new Date(0));
  customer.lastDeliveryDate = latestDelivery;

  //BilledAmount
  if (deliveredQuantity) {
    customer.billedAmount =
      customer.billedAmount + deliveredQuantity * customer.rate;
  }

  const remainingAmount =
    (customer.billedAmount || 0) - (customer.paidAmount || 0);
  customer.remainingAmount = remainingAmount;

  // Update currentJars and extraJars based on deliveries
  if (delivery.deliveredQuantity || delivery.returnedJars) {
    if (delivery.deliveredQuantity || delivery.returnedJars) {
      const deliveredQuantity = delivery.deliveredQuantity || 0;
      const returnedJars = delivery.returnedJars || 0;

      // Update currentJars based on delivered and returned jars
      customer.currentJars += deliveredQuantity - returnedJars;

      // Update extraJars based on the difference between currentJars and allotment
      customer.extraJars = customer.currentJars - customer.allotment;
      if (customer.extraJars < 0) {
        customer.extraJars = 0;
      }
    }
  }

  //updating payment too if they paid at time of delivery
  let payment;
  if (amountReceived && paymentMode) {
    payment = await Payment.create({
      customer: customerId,
      paymentDate: deliveryDate,
      amount: amountReceived,
      paymentMode,
    });

    customer.payments.push({
      paymentDate: deliveryDate,
      amount: amountReceived,
      paymentMode,
    });

    //Update paid Amount
    const paidAmount = customer.paidAmount + payment.amount;
    customer.paidAmount = paidAmount;

    //Update Remaining Amount
    const remainingAmount =
      (customer.billedAmount || 0) - (customer.paidAmount || 0);
    customer.remainingAmount = remainingAmount;
  }

  customer.lastUpdated = Date.now() + 5.5 * 60 * 60 * 1000;

  await customer.save();

  res.status(201).json({ success: true, delivery, payment });
});

exports.getDeliveriesForDay = catchAsyncError(async (req, res) => {
  const resultsPerPage = 20;
  const apiFeature = new ApiFeatures(Delivery.find(), req.query)
    .filter()
    .pagination(resultsPerPage);

  if (req.query.deliveryDate) {
    const startDate = new Date(req.query.deliveryDate);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    endDate.setTime(endDate.getTime() + 5.5 * 60 * 60 * 1000);
    apiFeature.query = apiFeature.query
      .where("deliveryDate")
      .gte(startDate)
      .lt(endDate);
  }

  const deliveries = await apiFeature.query;
  const deliveryCount = deliveries.length;
  const deliveriesWithCustomerDetails = await Promise.all(
    deliveries.map(async (delivery) => {
      try {
        const customer = await Customer.findOne({
          customerId: delivery.customer,
        });
        if (!customer) {
          throw new Error("Customer not found");
        }

        return {
          ...delivery.toObject(),
          customerId: customer.customerId,
          customerName: customer.name,
        };
      } catch (error) {
        console.error("Error retrieving customer details:", error);
        return delivery.toObject();
      }
    })
  );

  //get delivered jars , returned Jars and their difference
  const totalDeliveredJars = deliveries.reduce((accumulator, delivery) => {
    if (typeof delivery.deliveredQuantity === "number") {
      return accumulator + delivery.deliveredQuantity;
    }
    return accumulator;
  }, 0);

  const totalReturnedJars = deliveries.reduce((accumulator, delivery) => {
    if (typeof delivery.returnedJars === "number") {
      return accumulator + delivery.returnedJars;
    }
    return accumulator;
  }, 0);

  const diff = (totalDeliveredJars || 0) - (totalReturnedJars || 0);
  const finalDeliveryTotal = {
    totalDeliveredJars: totalDeliveredJars,
    totalReturnedJars: totalReturnedJars,
    diff: diff,
  };

  res.status(200).json({
    success: true,
    deliveriesWithCustomerDetails,
    deliveryCount,
    finalDeliveryTotal,
  });
});

exports.getDeliveryDetails = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  res.status(200).json({
    success: true,
    delivery,
  });
});

exports.updateDelivery = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  res.status(200).json({
    success: true,
    delivery,
  });
});

exports.deleteDelivery = catchAsyncError(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorHandler("Delivery not found", 404));
  }

  await delivery.deleteOne();

  res.status(200).json({
    success: true,
    message: "Delivery Deleted Successfully",
  });
});
