const { loginUser, registerUser, getAllUsers } = require("../controllers/userController");
const protect = require("../middleware/authMIddleware");

const router=require("express").Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);
router.route("/all").get(protect,getAllUsers)
module.exports=router