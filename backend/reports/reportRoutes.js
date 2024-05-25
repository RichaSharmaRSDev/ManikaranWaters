const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  generateDailyReport,
  generateMonthlyReport,
  generateDetailedMonthlyReport,
} = require("./dailyReport");

const router = express.Router();

router
  .route("/report/daily/:date?")
  .get(isAuthenticatedUser, generateDailyReport);

router
  .route("/report/monthly/:monthYear?")
  .get(isAuthenticatedUser, generateMonthlyReport);

router
  .route("/report/detailedMonthly/:monthYear?")
  .get(isAuthenticatedUser, generateDetailedMonthlyReport);

module.exports = router;
