const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { generateDailyReport } = require("./dailyReport");

const router = express.Router();

router
  .route("/report/daily/:date?")
  .get(isAuthenticatedUser, generateDailyReport);

module.exports = router;
