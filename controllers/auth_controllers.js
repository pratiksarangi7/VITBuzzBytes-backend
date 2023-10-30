const Otp = require("../models/otp_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const util = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.sendOtp = async (req, res, next) => {
  let otp;
  let email;
  try {
    email = req.body.email;
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpDoc = new Otp({ email, otp: hashedOtp });
    await otpDoc.save();
  } catch (e) {
    res.status(500).json({ status: "failure", message: e.message });
    return;
  }
  let config = {
    service: "gmail",
    auth: {
      user: "sarangipratik7@gmail.com",
      pass: "kcceubawgssqyygw",
    },
  };
  let transporter = nodemailer.createTransport(config);
  const mailOptions = {
    from: "sarangipratik7@com",
    to: email,
    subject: "VITXpress Registration: OTP",
    text: `Your one time password to get registered with VITXpress is: ${otp} \n. This OTP is valid for 5 minutes`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
      return;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).json({
    status: "success",
    message: "otp sent successfully",
  });
};

exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpDocs = await Otp.find({ email }).sort({ createdAt: -1 });
  const otpDoc = otpDocs[0];
  if (!otpDoc) {
    res.status(404).json({ status: "failure", message: "some error occured" });
    return;
  }
  const isMatch = await bcrypt.compare(otp, otpDoc.otp);
  if (!isMatch) {
    res.status(400).json({ message: "invalid otp" });
    return;
  }
  const token = signToken(email);
  res.status(200).json({ status: "success", message: "Otp correct", token });
  return;
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
