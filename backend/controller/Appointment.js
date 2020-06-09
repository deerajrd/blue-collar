const path = require("path");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Appointment = require("../models/Appointment");

exports.getAppointments = asyncHandler(async (req, res, next) => {
  const AppointmentList = await Appointment.find();
  res.status(200).json(AppointmentList);
});

exports.createAppointment = asyncHandler(async (req, res, next) => {
  // Add user details to req.body
  req.body = {
    user: req.user.id,
    name: req.user.name,
    email: req.user.email,
  };

  // Check for existing appointments
  const existingAppointment = await Appointment.findOne({
    user: req.user.id,
  });

  if (req.body.user == existingAppointment.user) {
    return next(new ErrorResponse(`Appointment exists`, 400));
  }

  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    success: true,
    data: appointment,
  });
});
