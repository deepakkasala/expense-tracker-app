const express = require("express");
const { protect } = require("../middlewares/auth");
const { getDashboardData } = require("../controllers/dashboard");
const router = express.Router();

router.get("/", protect, getDashboardData);

module.exports = router;
