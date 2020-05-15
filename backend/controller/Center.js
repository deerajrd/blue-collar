const path = require("path");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Center = require("../models/Center");


exports.getcenters = asyncHandler(async (req, res, next) => {
  const center = await Center.find().populate({
    path: "category",
    select: "catname",
  });
  res.status(200).json({
    success: true,
    count:center.length,
    data: center,
  });
});
  exports.getMe = asyncHandler(async (req, res, next) => {
    const center = await Center.findOne({ user: req.user.id }).populate({
      path: "category",
      select: "catname",
    });
  
    res.status(200).json({
      success: true,
      data: doctor,
    });
  });

  exports.getcenter = asyncHandler(async (req, res, next) => {
    // if (req.params.id) {
    const center = await Center.find();
    if (!center) {
      return next(
        new ErrorResponse(
          `center not found with id of ${req.params.centerId}`,
          404
        )
      );
    }
      // const products = await Products.find({ user: req.params.id });
  
      return res.status(200).json({
        success: true,
        count: center.length,
        data: center,
      });
    // } else {
    //   res.status(200).json(res.advancedResults);
    // }
  
    // if (!center) {
    //   return next(
    //     new ErrorResponse(
    //       `Center not found with id of ${req.params.centerId}`,
    //       404
    //     )
    //   );
    // }
  
    // res.status(200).json({ success: true, data: center });
  });
  // @desc      Create new fundriser
// @route     POST /api/v1/fundrisers
// @access    Private
exports.createcenter = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published fundrisers
  const publishedcenter = await Center.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one fundriser
  if (publishedcenter && req.user.role !== "admin") {
     return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already  a center`,
        400
     )
    );
   }

  const center = await Center.create(req.body);

  res.status(201).json({
    success: true,
    data: center,
  });
});

exports.updatecenter = asyncHandler(async (req, res, next) => {
    let center = await Center.findById(req.params.centerId);
  
    if (!center) {
      return next(
        new ErrorResponse(
          `center not found with id of ${req.params.centerId}`,
          404
        )
      );
    }
  
    center = await Center.findByIdAndUpdate(req.params.centerId, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({ success: true, data: center });
  });

  exports.deletecenter = asyncHandler(async (req, res, next) => {
    const center = await Center.findById(req.params.centerId);
  
    if (!center) {
      return next(
        new ErrorResponse(
          `center not found with id of ${req.params.centerId}`,
          404
        )
      );
    }  
  
    center.remove();
  
    res.status(200).json({ success: true, data: {} });
  });


  exports.centerPhotoUpload = asyncHandler(async (req, res, next) => {
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    file.mv(
      `${__dirname}/../../frontend/public/uploads/${file.name}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
  
        const files = `/uploads/${file.name}`;
  
        res.status(200).json({
          success: true,
          data: files,
        });
      }
    );
  });
  