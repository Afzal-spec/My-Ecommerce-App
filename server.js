import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path"; // Import path module

// Configure env
dotenv.config();

// Database config
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Serve frontend build files
const __dirname = path.resolve(); // Get root directory
app.use(express.static(path.join(__dirname, "/frontend/build"))); // Serve React build

// Handle all other routes by serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

// Port
const PORT = process.env.PORT || 8080;

// Run server
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white
  );
});
