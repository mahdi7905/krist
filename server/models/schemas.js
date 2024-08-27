const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isStrongPassword } = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [isStrongPassword, "Password is too weak"],
  },
  role: {
    type: String,
    required: [true, "User Must be assigned a role"],
    default: "consumer",
  },
});
const ProductSchema = new Schema({
  type: {
    type: String,
  },
  price: {
    type: Number,
  },
  size: {
    type: Number,
  },
  media: {
    type: String,
  },
});
const CartSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  item: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Product",
  },
});
const FavoriteSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  item: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Product",
  },
});
const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    products: {
      type: [mongoose.SchemaTypes.ObjectId],
      required: true,
      ref: "Product",
    },
    amount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingStatus: {
      type: String,
      required: true,
      default: "pending",
    },
    confirmation: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

UserSchema.statics.register = async function (username, password, role) {
  const exist = await this.findOne({ username });
  if (exist) {
    console.log(exist._id);
    throw new Error("Username already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await this.create({
    username,
    password: hashed,
    role,
  });
  return user;
};
UserSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const matchingPass = await bcrypt.compare(password, user.password);
    console.log(matchingPass);
    if (matchingPass) {
      return user;
    }
    throw new Error("Password Incorrect");
  }
  throw new Error("User could not be found");
};

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Cart = mongoose.model("Cart", CartSchema);
const Favorite = mongoose.model("Favorite", FavoriteSchema);
const Order = mongoose.model("Order", OrderSchema);
module.exports = { User, Product, Cart, Favorite, Order };
