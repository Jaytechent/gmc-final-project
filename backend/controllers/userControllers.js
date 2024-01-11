const { validationResult } = require("express-validator");
const UserModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { CustomErrorHandler } = require("../middleware/errorhandler");

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
  // console.log(checkUserAlreadyExists);
  const name = checkUserAlreadyExists.name;
  // compare user password
  const comparedPassword = await bcrypt.compare(
    password,
    checkUserAlreadyExists.password
  );
  if (!comparedPassword) {
    throw new CustomErrorHandler(404, `incorrect email or password`);
  }
  res.send({ name });
};

const generateResetToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found. Please register." });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 600000; // Token is valid for 10 minutes

    // Update user with reset token
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiration,
    });

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: user.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:3000/reset-password?token=${resetToken}`,
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

module.exports = {
  registerUser,
  loginUser,
  generateResetToken,
};
