const express = require("express");
const {
  getcenters,
  getcenter,
  createcenter,
  updatecenter,
  centerPhotoUpload,
  deletecenter,
} = require("../controller/Center");

const Center = require("../models/Center");
const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
router.route("/photo").post(protect, centerPhotoUpload);


router
  .route("/")
  .get(advancedResults(Center, "admin"), getcenters)
  .post(protect, authorize("center", "admin"), createcenter);

router
  .route("/:centerId")
  .get(getcenter)
  .put(protect, authorize("center", "admin"), updatecenter)
  .delete(protect, authorize("center", "admin"), deletecenter);

module.exports = router;