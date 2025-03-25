/**
 * Comment Routes
 * API endpoints for video comments (Continued)
 * 
 * @module routes/comment
 */
import express from "express";
import { addComment, deleteComment, getComment } from "../controllers/comment.js";
import { verifyToken } from  "../middleware/verifyToken.js";
import { param, body, query, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @route DELETE /api/comment/:id
 * @desc Delete a comment
 * @access Private
 */
router.delete("/:id", [
    verifyToken,
    // Input validation middleware
    param('id')
        .isMongoId().withMessage('Invalid comment ID format'),
    (req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], deleteComment);

export default router;