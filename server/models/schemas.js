const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isStrongPassword, isEmail, isMobilePhone } = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  phone: {
    type: Number,
    validator: [isMobilePhone, "Invalid Phone Number"],
  },
  email: {
    type: String,
    unique: true,
    validate: [isEmail, "Invalid email address"],
    required: [true, "Username is required"],
  },
  coutry: {
    type: String,
  },
  city: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [isStrongPassword, "Password is too weak"],
  },
});
const CartSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  items: {
    type: [String],
    required: true,
  },
});
const FavoriteSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  items: {
    type: [String],
    required: true,
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
      type: [
        {
          id: String,
          name: String,
          price: Number,
          media: String,
        },
      ],
      required: true,
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

UserSchema.statics.register = async function (
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
) {
  const usernameExist = await this.findOne({ username });
  if (usernameExist) {
    throw new Error("Username already in use");
  }
  const emailExist = await this.findOne({ email });
  if (emailExist) {
    throw new Error("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await this.create({
    firstName,
    lastName,
    username,
    phone,
    email,
    coutry,
    city,
    shippingAddress,
    zipCode,
    password: hashed,
  });
  return user;
};
UserSchema.statics.login = async function (username, email, password) {
  const user = await this.findOne({ username });
  const emailUser = await this.findOne({ email });
  if (user || emailUser) {
    const matchingPass = await bcrypt.compare(
      password,
      user.password || emailUser.password
    );
    console.log(matchingPass);
    if (matchingPass) {
      return user;
    }
    throw new Error("Password Incorrect");
  }
  if (!user) {
    throw new Error("User could not be found");
  }
  if (!emailUser) {
    throw new Error(" User with this email not found");
  }
};

const User = mongoose.model("User", UserSchema);
const Cart = mongoose.model("Cart", CartSchema);
const Favorite = mongoose.model("Favorite", FavoriteSchema);
const Order = mongoose.model("Order", OrderSchema);
module.exports = { User, Cart, Favorite, Order };
