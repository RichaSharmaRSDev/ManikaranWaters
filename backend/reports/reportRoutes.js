const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { generateDailyReport, generateMonthlyReport } = require("./dailyReport");

const router = express.Router();

router
  .route("/report/daily/:date?")
  .get(isAuthenticatedUser, generateDailyReport);

router
  .route("/report/monthly/:monthYear?")
  .get(isAuthenticatedUser, generateMonthlyReport);

module.exports = router;
