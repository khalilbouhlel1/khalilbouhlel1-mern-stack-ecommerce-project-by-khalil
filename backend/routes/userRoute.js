import express from "express";
import { 
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
  updateProfile
} from "../controllers/userController.js";
import adminAuth from '../middlewares/adminAuth.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/adminlogin", adminLogin);
router.post("/logout", auth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Admin routes
router.get("/verify-admin", adminAuth, (req, res) => {
  res.json({ success: true, message: 'Admin verified successfully' });
});
router.get("/allusers", adminAuth, getAllUsers);
router.delete("/delete/:id", adminAuth, deleteUser);
router.put("/update/:id", adminAuth, updateUser);
router.get("/:id", adminAuth, getUserById);

// Add this with your other routes
router.put("/profile/update", auth, updateProfile);

// Add this new route
router.get("/verify", auth, (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        isAdmin: req.user.isAdmin || false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying user'
    });
  }
});

export default router;