const express = require("express");
const {
  getAppointments,
  createAppointment,
} = require("../controller/Appointment");

const Appointment = require("../models/Appointment");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getAppointments)
  .post(protect, authorize("appointments", "employer"), createAppointment);

module.exports = router;
