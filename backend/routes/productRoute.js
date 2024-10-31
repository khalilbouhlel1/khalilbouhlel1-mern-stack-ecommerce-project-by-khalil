import express from "express";
import { addProduct, deleteProduct, listProduct, singleProductInfo, updateProduct } from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, upload.single('image'), addProduct);
router.get("/list", listProduct);
router.put("/:id", adminAuth, upload.single('image'), updateProduct);
router.delete("/delete/:id", adminAuth, deleteProduct);
router.get("/:id", singleProductInfo);

export default router;