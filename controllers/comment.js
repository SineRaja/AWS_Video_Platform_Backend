/**
 * Comment Controller
 * Handles CRUD operations for video comments
 * 
 * @module controllers/comment
 */
import { createError } from "../utils/error.js";
import Comment from "../models/Comments.js";
import Video from "../models/Video.js";
import mongoose from "mongoose";

/**
 * Add a new comment to a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Created comment data
 */
export const addComment = async (req, res, next) => {
    try {
        // Validate request
        if (!req.body.videoId || !req.body.comment) {
            return next(createError(400, "VideoId and comment text are required"));
        }
        
        if (req.body.comment.trim().length === 0) {
            return next(createError(400, "Comment cannot be empty"));
        }
        
        // Verify video exists
        const videoExists = await Video.exists({ _id: req.body.videoId });
        if (!videoExists) {
            return next(createError(404, "Video not found"));
        }
        
        // Create new comment
        const newComment = new Comment({
            ...req.body, 
            userId: req.user.id,
            comment: req.body.comment.trim()
        });

        const savedComment = await newComment.save();
        
        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Add comment error:", error);
        
        // Handle invalid ObjectId format
        if (error instanceof mongoose.Error.CastError) {
            return next(createError(400, "Invalid video ID format"));
        }
        
        next(error);
    }
};

/**
 * Delete a comment
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const deleteComment = async (req, res, next) => {
    try {
        // Fixed the typo (res.params.id => req.params.id)
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(createError(400, "Invalid comment ID"));
        }
        
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(createError(404, "Comment not found"));
        }
        
        const video = await Video.findById(comment.videoId);
        if (!video) {
            return next(createError(404, "Video not found"));
        }
        
        // Check authorization (comment owner or video owner)
        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Comment has been deleted" });
        } else {
            return next(createError(403, "You can only delete your own comments"));
        }
    } catch (error) {
        console.error("Delete comment error:", error);
        next(error);
    }
};

/**
 * Get all comments for a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of comments
 */
export const getComment = async (req, res, next) => {
    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(req.params.videoId)) {
            return next(createError(400, "Invalid video ID"));
        }
        
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        // Get comments with user information
        const comments = await Comment.find({ videoId: req.params.videoId })
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(limit);
        
        // Get total comments count for pagination
        const totalComments = await Comment.countDocuments({ videoId: req.params.videoId });
        
        res.status(200).json({
            comments,
            pagination: {
                total: totalComments,
                page,
                pages: Math.ceil(totalComments / limit)
            }
        });
    } catch (error) {
        console.error("Get comments error:", error);
        next(error);
    }
};