const express = require("express");
const { generateDashboard } = require("../controllers/dashboardController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/dashboard").get(isAuthenticatedUser, generateDashboard);

module.exports = router;
