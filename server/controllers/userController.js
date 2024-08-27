const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../models/schemas");
// const upload = require("../middleware/uploadAvatar");

const createToken = (_id) => {
  if (mongoose.Types.ObjectId.isValid(_id)) {
    const token = jwt.sign({ _id }, process.env.JWT);
    return token;
  }
  return null;
};

const handleError = (err) => {
  let error = {
    username: "",
    password: "",
  };
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  if (err.message === "Password Incorrect") {
    error.password = "Password Incorrect";
  }
  if (err.message === "Username already in use") {
    error.username = "Username already in use";
  }
  if (err.message === "User could not be found") {
    error.username = "User not found";
  }
  return error;
};

const registerController = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.register(username, password, role);
    const token = createToken(user._id);
    res.status(200).json({
      user: {
        token,
        _id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.status(200).json({
      user: {
        token,
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        address: user.address,
        wallet: user.wallet,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

const getUserController = async (req, res) => {
  const { _id } = jwt.verify(req.body.token, process.env.JWT);
  try {
    const user = await User.findById({ _id });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  registerController,
  loginController,
  getUserController,
};
