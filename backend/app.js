const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

const customer = require("./routes/customerRoute");
const user = require("./routes/userRoute");
const delivery = require("./routes/deliveryRoute");
const payment = require("./routes/paymentRoute");
const report = require("./reports/reportRoutes");
const expense = require("./routes/expenseRoute");
app.use("/api/v1", customer);
app.use("/api/v1", user);
app.use("/api/v1", delivery);
app.use("/api/v1", payment);
app.use("/api/v1", report);
app.use("/api/v1", expense);

// MiddleWare for Error
app.use(errorMiddleware);

module.exports = app;
