const router = require("express").Router();
const {
  addToGroup,
  removeFromGroup,
  renameGroup,
  createGroup,
  fetchChats,
  accessChat,
} = require("../controllers/ChatController");
const protect = require("../middleware/authMIddleware");
//@ create or fetch one on one chat
router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
module.exports = router;
