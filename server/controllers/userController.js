const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../models/schemas");

const createToken = (_id) => {
  if (mongoose.Types.ObjectId.isValid(_id)) {
    const token = jwt.sign({ _id }, process.env.JWT);
    return token;
  }
  return null;
};

const handleError = (err) => {
  let error = {
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
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
  if (err.message === "Email already in use") {
    error.email = "Email already in use";
  }
  if (err.message === "User could not be found") {
    error.username = "User not found";
  }
  if (err.message === "User with this email could not be found") {
    error.email = "User with this email could not be found";
  }
  return error;
};

const registerController = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    phone,
    email,
    coutry,
    city,
    shippingAddress,
    zipCode,
    password,
  } = req.body;

  try {
    const user = await User.register(
      firstName,
      lastName,
      username,
      phone,
      email,
      coutry,
      city,
      shippingAddress,
      zipCode,
      password
    );
    const token = createToken(user._id);
    res.status(200).json({
      user: {
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        coutry: user.coutry,
        city: user.city,
        shippingAddress: user.shippingAddress,
        zipCode: user.zipCode,
      },
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

const loginController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.login(username, email, password);
    const token = createToken(user._id);
    res.status(200).json({
      user: {
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        coutry: user.coutry,
        city: user.city,
        shippingAddress: user.shippingAddress,
        zipCode: user.zipCode,
      },
    });
  } catch (err) {
    const error = handleError(err);
    res.status(400).json({ error });
  }
};

module.exports = {
  registerController,
  loginController,
};
