/**
 * Authentication Routes
 * API endpoints for user registration, login, and authentication
 * 
 * @module routes/authentications
 */
import express from "express";
import { signin, signup, googleAuth, logout } from "../controllers/authentication.js";
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", [
    // Input validation middleware
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$/)
        .withMessage('Password must be 8-24 characters with uppercase, lowercase, number and special character'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], signup);

/**
 * @route POST /api/auth/signin
 * @desc Login a user
 * @access Public
 */
router.post("/signin", [
    // Input validation middleware
    body('name')
        .trim()
        .notEmpty().withMessage('Username is required'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], signin);

/**
 * @route POST /api/auth/google
 * @desc Authenticate with Google
 * @access Public
 */
router.post("/google", [
    // Input validation middleware
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], googleAuth);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
router.post('/logout', logout);

/**
 * @route GET /api/auth/verify
 * @desc Verify JWT token is valid
 * @access Public
 */
router.get('/verify', (req, res) => {
    // This is handled by the verifyToken middleware
    // If the request makes it here, the token is valid
    res.status(200).json({ valid: true });
});

export default router;