import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token based
export const requireSignin = async (req, res, next) => {
    try {
        // Check if the authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).send({
                success: false,
                message: 'Authorization token is required',
            });
        }
        
        // Verify the JWT token
        const token = req.headers.authorization.split(" ")[1]; // Extract token part
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        
        req.user = decode; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'Invalid or expired token', // More descriptive error message
        });
    }
};

// Admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id); // Find the user by ID

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        
        if (user.role !== 1) { // Assuming 1 is the role for admin
            return res.status(403).send({ // 403 for Forbidden
                success: false,
                message: 'Unauthorized Access',
            });
        }
        
        next(); // Proceed to the next middleware
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Server Error', // General error message
        });
    }
};
