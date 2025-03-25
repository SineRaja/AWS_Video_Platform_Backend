/**
 * Video Routes
 * API endpoints for video management and retrieval
 * 
 * @module routes/videos
 */
import express from "express";
import { 
    addVideo, 
    addView, 
    deleteVideo, 
    getBySearch, 
    getByTag, 
    getVideo, 
    randomVideo, 
    subscribeVideo, 
    trendVideo, 
    updateVideo 
} from "../controllers/video.js";
import { verifyToken } from  "../middleware/verifyToken.js";
import { param, body, query, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @route POST /api/videos
 * @desc Create a new video
 * @access Private
 */
router.post("/", [
    verifyToken,
    // Input validation middleware
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('videoDescription')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('imgURL')
        .trim()
        .notEmpty().withMessage('Thumbnail image URL is required')
        .isURL().withMessage('Thumbnail must be a valid URL'),
    body('videoUrl')
        .trim()
        .notEmpty().withMessage('Video URL is required')
        .isURL().withMessage('Video URL must be a valid URL'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom(value => value.length <= 20).withMessage('Cannot have more than 20 tags'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], addVideo);

/**
 * @route PUT /api/videos/:id
 * @desc Update a video
 * @access Private
 */
router.put("/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid video ID format'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('videoDescription')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('imgURL')
        .optional()
        .trim()
        .isURL().withMessage('Thumbnail must be a valid URL'),
    body('videoUrl')
        .optional()
        .trim()
        .isURL().withMessage('Video URL must be a valid URL'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom(value => value.length <= 20).withMessage('Cannot have more than 20 tags'),
    body('status')
        .optional()
        .isIn(['public', 'private', 'unlisted']).withMessage('Status must be public, private, or unlisted'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], updateVideo);

/**
 * @route DELETE /api/videos/:id
 * @desc Delete a video
 * @access Private
 */
router.delete("/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid video ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], deleteVideo);

/**
 * @route GET /api/videos/find/:id
 * @desc Get a specific video
 * @access Private
 */
router.get("/find/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid video ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getVideo);

/**
 * @route PUT /api/videos/view/:id
 * @desc Increment video view count
 * @access Public
 */
router.put("/view/:id", [
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid video ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], addView);

/**
 * @route GET /api/videos/trendvideo
 * @desc Get trending videos
 * @access Public
 */
router.get("/trendvideo", [
    // Input validation middleware
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], trendVideo);

/**
 * @route GET /api/videos/randomvideo
 * @desc Get random videos
 * @access Public
 */
router.get("/randomvideo", [
    // Input validation middleware
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], randomVideo);

/**
 * @route GET /api/videos/subscribevideos
 * @desc Get videos from subscribed channels
 * @access Private
 */
router.get("/subscribevideos", [
    verifyToken,
    // Input validation middleware
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], subscribeVideo);

/**
 * @route GET /api/videos/tags
 * @desc Get videos by tags
 * @access Public
 */
router.get("/tags", [
    // Input validation middleware
    query('tags')
        .notEmpty().withMessage('Tags parameter is required'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getByTag);

/**
 * @route GET /api/videos/search
 * @desc Search videos by title
 * @access Public
 */
router.get("/search", [
    // Input validation middleware
    query('q')
        .notEmpty().withMessage('Search query is required'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getBySearch);

export default router;