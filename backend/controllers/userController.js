import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from 'validator';
import crypto from 'crypto';

// Add these helper functions at the top of the file
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token - Update the token structure
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Updated response structure
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      token: `Bearer ${token}`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Input validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    // Password strength validation
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false, // Explicitly set default value
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin || false, // Consistent with login
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false, // Added isAdmin to response
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all credentials" });
    }

    // Check against environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate admin token with correct structure
      const token = jwt.sign(
        {
          email: process.env.ADMIN_EMAIL,
          isAdmin: true,
          role: "admin"
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        token: `Bearer ${token}`,
        email: process.env.ADMIN_EMAIL,
      });
    } else {
      res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    // Since JWT is stateless, we can't invalidate the token on the server
    // Best practice is to handle logout on the client side by removing the token

    // Optional: If you're using HTTP-only cookies
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Added secure flag for production
      sameSite: "strict", // Added sameSite protection
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// users CRUD
// delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
// update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if email is already taken by another user
    const existingUser = await UserModel.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password -cartdata");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};
// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // Exclude password field
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
// get user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await UserModel.findById(id).select("-password -cartdata");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

// Helper function for token generation
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Add password reset functionality
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email logic here
    // You can implement this using nodemailer

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

// Add reset password functionality
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, currentPassword, newPassword } = req.body;

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Check if email is taken by another user
    const existingUser = await UserModel.findOne({
      email,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use"
      });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set new password"
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user information
    user.name = name;
    user.email = email;
    await user.save();

    // Return updated user without sensitive information
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message
    });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  logoutUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
  forgotPassword,
  resetPassword,
  updateProfile,
};
