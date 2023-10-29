const Otp = require("../models/otp_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).json({
    status: "success",
    message: "otp sent successfully",
  });
};