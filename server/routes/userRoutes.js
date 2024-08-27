const express = require("express");
// const upload = require("../middleware/uploadAvatar");

const {
  registerController,
  loginController,
  getUserController,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/get-user", getUserController);

module.exports = { userRouter };
