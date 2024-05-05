const { validationResult } = require("express-validator");
const UserModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { CustomErrorHandler } = require("../middleware/errorhandler");
const crypto = require('crypto')
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const checkUserAlreadyExists = await UserModel.findOne({ email });

  if (checkUserAlreadyExists) {
    throw new CustomErrorHandler(404, `User with ${email} already exists`);
  }

  const newUser = await UserModel.create({ name, email, password });
  // Additional logic if needed after creating the user
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  // find user by email
  const checkUserAlreadyExists = await UserModel.findOne({ email: email });
  if (!checkUserAlreadyExists) {
    throw new CustomErrorHandler(404, `incorrect email or password`);
  }
  const name = checkUserAlreadyExists.name;
  // compare user password
  const comparedPassword = await bcrypt.compare(
    password,
    checkUserAlreadyExists.password
  );
  if (!comparedPassword) {
    throw new CustomErrorHandler(404, `incorrect email or password`);
  }
  res.send({ name, userId: checkUserAlreadyExists._id });
};




const generateResetToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found. Please register." });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 9000000; // Token is valid for 10 minutes

    // Update user with reset token
    await UserModel.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiration,
    });

    // Send password reset email
    require("dotenv").config();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    require("dotenv").config();
    const FRONTEND_URL = process.env.FRONTEND_URL;
console.log(FRONTEND_URL)


    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset from GMC Ads",
      html: `
        Click the following link to reset your password:<br/>
        <button style="padding:10px; background:red; border-radius: 20px; color:white;">
          <a href="${FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}" style="text-decoration:none; color:white">Reset Password</a>
        </button>
        <p> RESET TOKEN: ${resetToken}</p>
      `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send reset email." });
      }

      console.log("Email sent:", info.response);
      res.json({ message: "Password reset email sent." });
    });
  } catch (error) {
    console.error("Error generating reset token:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
console.log(req.body);
  try {
    // Check if the token is valid
    const user = await UserModel.findOne({email,
    resetToken,
    resetTokenExpiration: { $gt: Date.now() }})
  

    if (!user || user.resetToken !== resetToken) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }


    // Update the user's password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(201).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



module.exports = {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
};
