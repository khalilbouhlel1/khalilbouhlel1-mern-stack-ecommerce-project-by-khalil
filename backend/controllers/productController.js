import ProductModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// add product
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, sizes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "products",
      use_filename: true,
      unique_filename: true,
    });
    // Delete the file from local storage after upload
    fs.unlinkSync(file.path);

    // Parse sizes and stock
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const stock = {};

    // Initialize stock for each size from the request body
    parsedSizes.forEach((size) => {
      stock[size] = parseInt(req.body[`stock[${size}]`]) || 0;
    });

    // Create new product with Cloudinary URL
    const product = await ProductModel.create({
      name,
      price: Number(price),
      description,
      category,
      subcategory,
      sizes: parsedSizes,
      image: [result.secure_url],
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    // If there's an error and a file was uploaded locally, clean it up
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// list product
const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in listProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse the stock data
    if (updateData.stock) {
      const stockArray = JSON.parse(updateData.stock);
      const stockMap = new Map();
      stockArray.forEach(({ size, quantity }) => {
        stockMap.set(size, quantity);
      });
      updateData.stock = stockMap;
    }

    // Parse sizes if present
    if (updateData.sizes) {
      updateData.sizes = JSON.parse(updateData.sizes);
    }

    // Only update image if a new file was uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else {
      // Remove image field if no new file was uploaded
      delete updateData.image;
    }

    const product = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};
// delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete from Cloudinary if image exists and is a Cloudinary URL
    if (product.image && Array.isArray(product.image)) {
      for (const imageUrl of product.image) {
        if (imageUrl && imageUrl.includes("cloudinary")) {
          try {
            // Extract public ID correctly
            const splitUrl = imageUrl.split("/");
            const publicId = `products/${
              splitUrl[splitUrl.length - 1].split(".")[0]
            }`;

            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error("Error deleting from Cloudinary:", cloudinaryError);
            // Continue with deletion even if Cloudinary fails
          }
        }
      }
    }

    // Delete the product from database
    await ProductModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};
// single product info
const singleProductInfo = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in singleProductInfo:", {
      error: error.message,
      stack: error.stack,
      productId: req.params.id,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  addProduct,
  listProduct,
  updateProduct,
  deleteProduct,
  singleProductInfo,
};
