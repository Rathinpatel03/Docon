const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
const secret = "secret";
const mongoose = require("mongoose");

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await userModel.findOne({ email }).populate("roleId");

    if (!foundUser) {
      return res.status(404).json({ message: "Email not found." });
    }

    const isMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Login successful",
      data: foundUser,
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Signup User
const signup = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    const createdUser = await userModel.create(req.body);

    await mailUtil.sendingMail(
      createdUser.email,
      "Welcome to Docon",
      "This is a welcome mail."
    );

    res.status(201).json({
      message: "User created",
      data: createdUser,
    });
  } catch (err) {
    console.error("Signup error: ", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Add User
const addUser = async (req, res) => {
  try {
    const savedUser = await userModel.create(req.body);
    res.json({
      message: "User saved successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error("Add user error: ", err);
    res.status(500).json({ message: "Error adding user", error: err.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("roleId");
    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users: ", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const foundUser = await userModel.findById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User fetched successfully",
      data: foundUser,
    });
  } catch (err) {
    console.error("Error fetching user by ID: ", err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// Delete User by ID
const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    console.error("Error deleting user: ", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// Get Users by Role ID
const getUsersByRoleId = async (req, res) => {
  const { roleId } = req.params;
  try {
    const users = await userModel.find({ roleId }).populate("roleId");
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found with the provided role ID" });
    }
    res.json({
      message: "Users fetched by role successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users by role ID: ", err);
    res.status(500).json({
      message: "Error fetching users by role",
      error: err.message,
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const foundUser = await userModel.findOne({ email });

    if (foundUser) {
      const token = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        secret,
        { expiresIn: "1h" }
      );

      const url = `http://localhost:5173/resetpassword/${token}`;

      const mailContent = `
      <html>
        <a href="${url}">Reset Password</a>
        </html>
      `;

      await mailUtil.sendingMail(foundUser.email, "Reset Password", mailContent);

      return res.json({
        message: "Reset password link sent to email",
      });
    } else {
      return res.status(404).json({
        message: "User not found. Please register first.",
      });
    }

  } catch (err) {
    console.error("Error sending reset password link: ", err);
    res.status(500).json({
      message: "Error sending reset link",
      error: err.message,
    });
  }
};

// Reset Password
const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decodedToken = jwt.verify(token, secret);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await userModel.findByIdAndUpdate(decodedToken.id, {
      password: hashedPassword,
    });

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error resetting password: ", err);
    res.status(500).json({
      message: "Error resetting password",
      error: err.message,
    });
  }
};

// Export All
module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
  getUsersByRoleId,
  forgotPassword,
  resetpassword,
};