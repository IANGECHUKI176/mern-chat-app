const {
  sendMessage,
  getAllMessages,
} = require("../controllers/MessageController");
const protect = require("../middleware/authMIddleware");

const router = require("express").Router();

router.route("/new").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessages);
module.exports = router;
