import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';
import path from 'path';

// Configure env
dotenv.config();

// Database config
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Rest API
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the E-commerce App</h1>");
});

// Serve static files from the React app
const __dirname = path.resolve(); // Define __dirname for ES modules
app.use(express.static(path.join(__dirname, 'client/build'))); // Adjust path as needed

// The catch-all handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html')); // Adjust path as needed
});

// Port
const PORT = process.env.PORT || 8080;

// Run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
});
