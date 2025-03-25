/**
 * User Routes
 * API endpoints for user management and interactions
 * 
 * @module routes/users
 */
import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unSubscribe, update } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { param, body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @route PUT /api/users/:id
 * @desc Update user details
 * @access Private
 */
router.put("/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid user ID format'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
    body('password')
        .optional()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$/)
        .withMessage('Password must be 8-24 characters with uppercase, lowercase, number and special character'),
    body('phoneNumber')
        .optional()
        .trim(),
    body('address')
        .optional()
        .trim(),
    body('img')
        .optional()
        .trim()
        .isURL().withMessage('Profile image must be a valid URL'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], update);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user account
 * @access Private
 */
router.delete("/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid user ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], deleteUser);

/**
 * @route GET /api/users/find/:id
 * @desc Get user profile
 * @access Public
 */
router.get("/find/:id", [
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid user ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getUser);

/**
 * @route PUT /api/users/sub/:id
 * @desc Subscribe to a channel
 * @access Private
 */
router.put("/sub/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid channel ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], subscribe);

/**
 * @route PUT /api/users/unsub/:id
 * @desc Unsubscribe from a channel
 * @access Private
 */
router.put("/unsub/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid channel ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], unSubscribe);

/**
 * @route PUT /api/users/like/:videoid
 * @desc Like a video
 * @access Private
 */
router.put("/like/:videoid", [
    verifyToken,
    // Input validation middleware
    param('videoid')
        .isMongoId().withMessage('Invalid video ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], like);

/**
 * @route PUT /api/users/dislike/:videoid
 * @desc Dislike a video
 * @access Private
 */
router.put("/dislike/:videoid", [
    verifyToken,
    // Input validation middleware
    param('videoid')
        .isMongoId().withMessage('Invalid video ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], dislike);

export default router;