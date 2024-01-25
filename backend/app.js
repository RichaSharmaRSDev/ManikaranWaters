const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const errorMiddleware = require("./middleware/error");

//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());

const customer = require("./routes/customerRoute");
const user = require("./routes/userRoute");
const delivery = require("./routes/deliveryRoute");
const payment = require("./routes/paymentRoute");
const report = require("./reports/reportRoutes");
const expense = require("./routes/expenseRoute");
const jar = require("./routes/jarInventoryRoute");
const trip = require("./routes/tripsRoute");
app.use("/api/v1", customer);
app.use("/api/v1", user);
app.use("/api/v1", delivery);
app.use("/api/v1", payment);
app.use("/api/v1", report);
app.use("/api/v1", expense);
app.use("/api/v1", jar);
app.use("/api/v1", trip);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// MiddleWare for Error
app.use(errorMiddleware);

module.exports = app;
