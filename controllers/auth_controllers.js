const Otp = require("../models/otp_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const util = require("util");

exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  // I) check if token exists or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(404).json({ status: "failure", message: "no token" });
    return;
  }
  try {
    // II) check if token is valid
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ); // throws error if token is invalid, returns decoded value if token is valid
    console.log(decoded);
    // III) take user data from req.body, save it to db
    const { userID, password, confirmPassword } = req.body;
    const user = await User.create({
      email: decoded.id,
      userID,
      password,
      confirmPassword,
    });
    res
      .status(201)
      .json({ status: "success", message: "user created successfully" });
    return;
  } catch (err) {
    res.status(401).json({ status: "failure", message: err.message });
    return;
  }
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  // i) find user by email
  const userDoc = await User.findOne({ email });
  // if email doesn't exist, or password is wrong:
  if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
    res
      .status(401)
      .json({ status: "failure", message: "Email/password is incorrect" });
    return;
  }
  const token = signToken(email);
  res
    .status(200)
    .json({ status: "Failure", message: "Logged in successfully", token });
};

exports.protect = async (req, res, next) => {
  try {
    // 1) get user's token:
    if (req.headers.authorization.startsWith("Bearer")) {
      userToken = req.headers.authorization.split(" ")[1];
    }
    if (!userToken) {
      throw new Error("No token present");
    }
    const decodedToken = await util.promisify(jwt.verify)(
      userToken,
      process.env.JWT_SECRET
    );
    const user = await User.findOne({ email: decodedToken.id });
    if (!user) {
      throw new Error("User no longer exists. Kindly signup again");
    }
    // we pass data from one middleware to the next in the following way:
    req.user = user;
    console.log("Protection successful");
    next();
  } catch (e) {
    res.status(401).json({ status: "failure", message: e.message });
    return;
  }
};
