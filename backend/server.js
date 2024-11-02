import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import newsletterRoute from "./routes/newslettersRoute.js";
dotenv.config();
connectDB();
connectCloudinary();
const app = express();



//middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json());
//api end point
app.get("/", (req, res) => {
  res.send("Hello World");
});
// user route
app.use("/api/user", userRoute);
// product route
app.use("/api/product", productRoute);
// newsletter route
app.use("/api/newsletter", newsletterRoute);

// server running
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});