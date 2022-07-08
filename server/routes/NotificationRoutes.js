const {
  getAllNotifications,
  deleteNotification,
  createNewNotification,
} = require("../controllers/NotificationController");
const protect = require("../middleware/authMIddleware");

const router = require("express").Router();

router.route("/new").post(protect, createNewNotification);
router.route("/all").get(protect, getAllNotifications);
router.route("/:id").delete(protect, deleteNotification);
module.exports = router;
