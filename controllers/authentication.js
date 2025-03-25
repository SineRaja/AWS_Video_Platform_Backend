/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 * 
 * @module controllers/authentication
 */
import mongoose from 'mongoose';
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken';

/**
 * User registration
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
export const signup = async (req, res, next) => {
  try {
      // Validate password pattern
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$/;

      if (!passwordPattern.test(req.body.password)) {
          return res.status(400).json({ 
              message: "Password must be 8-24 characters and include uppercase, lowercase, number, and special character" 
          });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
          $or: [
              { email: req.body.email },
              { name: req.body.name }
          ]
      });

      if (existingUser) {
          return res.status(400).json({ 
              message: existingUser.email === req.body.email ? 
                  "Email already in use" : 
                  "Username already taken" 
          });
      }

      // Hash password and create user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({ ...req.body, password: hash });

      await newUser.save();
      
      // Create token for auto login
      const token = jwt.sign({ id: newUser._id }, process.env.JWT, { expiresIn: '1d' });
      
      const { password, ...userData } = newUser._doc;
      
      // Set cookie with proper security options
      const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
      };
      
      res.cookie("access_token", token, cookieOptions)
         .status(201)
         .json({ 
             message: "User created successfully",
             user: userData
         });
  } catch (err) {
      // Log error for monitoring
      console.error("Signup error:", err);
      
      // Handle MongoDB duplicate key error
      if (err.code === 11000) {
          return res.status(400).json({ 
              message: "Email or username already exists" 
          });
      }
      
      next(err);
  }
};

/**
 * User login
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User data and JWT token
 */
export const signin = async (req, res, next) => {
    try {
        // Find user
        const user = await User.findOne({name: req.body.name}).select('+password');
        if (!user) return next(createError(404, "User not found"));
        
        // Check if account is active
        if (user.active === false) {
            return next(createError(403, "Account has been deactivated"));
        }

        // Verify password
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) return next(createError(400, "Invalid credentials"));

        // Create token
        const token = jwt.sign({id: user._id}, process.env.JWT, { expiresIn: '1d' });
        
        // Remove sensitive data
        const {password, ...others} = user._doc;

        // Set cookie with proper security options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        res.cookie("access_token", token, cookieOptions)
           .status(200)
           .json(others);
    } catch (err) {
        console.error("Signin error:", err);
        next(err);
    }
};

/**
 * Google OAuth authentication
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User data and JWT token
 */
export const googleAuth = async (req, res, next) => {
    try {
        // Validate required fields
        if (!req.body.email || !req.body.name) {
            return next(createError(400, "Email and name are required"));
        }
        
        // Find or create user
        const user = await User.findOne({ email: req.body.email });
        
        if (user) {
            // User exists, sign them in
            const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });
            
            // Set cookie with proper security options
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            };
            
            res.cookie("access_token", token, cookieOptions)
               .status(200)
               .json(user._doc);
        } else {
            // Create new user
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });
            
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT, { expiresIn: '1d' });
            
            // Set cookie with proper security options
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            };
            
            res.cookie("access_token", token, cookieOptions)
               .status(200)
               .json(savedUser._doc);
        }
    } catch (err) {
        console.error("Google auth error:", err);
        next(err);
    }
};

/**
 * User logout
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
export const logout = (req, res) => {
    try {
        // Clear JWT cookie
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout error' });
    }
};