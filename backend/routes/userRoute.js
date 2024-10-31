import express from "express";
import { loginUser, registerUser, adminLogin, logoutUser, deleteUser, updateUser, getAllUsers, getUserById } from "../controllers/userController.js";
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/adminlogin", adminLogin);
router.post("/logout", logoutUser);
router.get("/verify-admin", adminAuth, (req, res) => {
  res.json({ 
    success: true,
    message: 'Admin verified successfully'
  });
});
router.get("/allusers", adminAuth, getAllUsers);
router.delete("/delete/:id", adminAuth, deleteUser);
router.put("/update/:id", adminAuth, updateUser);
router.get("/:id", adminAuth, getUserById);

export default router;