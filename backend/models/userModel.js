const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validator: [validator.isEmail, "Please neter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    validator: [validator.isEmail, "Please neter a valid email"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now() + 5.5 * 60 * 60 * 1000,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding to UserSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 5.5 * 60 * 60 * 1000 + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
