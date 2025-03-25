/**
 * Video Controller
 * Handles CRUD operations and interactions for videos
 * 
 * @module controllers/video
 */
import { createError } from "../utils/error.js";
import User from "../models/User.js";
import Video from '../models/Video.js';
import mongoose from "mongoose";

/**
 * Add a new video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Created video data
 */
export const addVideo = async (req, res, next) => {
    try {
        // Validate required fields
        const { title, videoDescription, imgURL, videoUrl } = req.body;
        
        if (!title || !videoDescription || !imgURL || !videoUrl) {
            return next(createError(400, "Missing required video information"));
        }
        
        // Validate URLs
        const urlPattern = /^(https?|s3):\/\/\S+/;
        if (!urlPattern.test(imgURL) || !urlPattern.test(videoUrl)) {
            return next(createError(400, "Invalid image or video URL format"));
        }
        
        // Create new video
        const newVideo = new Video({
            userId: req.user.id, 
            ...req.body,
            title: req.body.title.trim(),
            videoDescription: req.body.videoDescription.trim()
        });
        
        // Limit tags to 20
        if (req.body.tags && req.body.tags.length > 20) {
            newVideo.tags = req.body.tags.slice(0, 20);
        }
        
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (err) {
        console.error("Add video error:", err);
        next(err);
    }
};

/**
 * Update a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Updated video data
 */
export const updateVideo = async (req, res, next) => {
    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(createError(400, "Invalid video ID"));
        }
        
        // Find video by ID
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found"));
        }
        
        // Check authorization
        if (req.user.id !== video.userId) {
            return next(createError(403, "You can only update your own videos"));
        }
        
        // Prepare update data
        const updateData = { ...req.body };
        
        // Prevent updating certain fields
        delete updateData.userId; // Can't change video owner
        delete updateData.views; // Can't manually update views
        delete updateData.likes; // Can't manually update likes
        delete updateData.dislikes; // Can't manually update dislikes
        
        // Validate URLs if they're being updated
        const urlPattern = /^(https?|s3):\/\/\S+/;
        if (updateData.imgURL && !urlPattern.test(updateData.imgURL)) {
            return next(createError(400, "Invalid image URL format"));
        }
        if (updateData.videoUrl && !urlPattern.test(updateData.videoUrl)) {
            return next(createError(400, "Invalid video URL format"));
        }
        
        // Limit tags to 20
        if (updateData.tags && updateData.tags.length > 20) {
            updateData.tags = updateData.tags.slice(0, 20);
        }
        
        // Update video
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedVideo);
    } catch (err) {
        console.error("Update video error:", err);
        next(err);
    }
};

/**
 * Delete a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const deleteVideo = async (req, res, next) => {
    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(createError(400, "Invalid video ID"));
        }
        
        // Find video by ID
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found"));
        }
        
        // Check authorization
        if (req.user.id !== video.userId) {
            return next(createError(403, "You can only delete your own videos"));
        }
        
        // Delete video
        await Video.findByIdAndDelete(req.params.id);
        
        // Note: In a production system, you might want to:
        // 1. Delete associated comments 
        // 2. Remove video file from storage (AWS S3, etc.)
        // 3. Consider soft deletion instead
        
        res.status(200).json({ message: "Video has been deleted" });
    } catch (err) {
        console.error("Delete video error:", err);
        next(err);
    }
};

/**
 * Get a specific video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Video data
 */
export const getVideo = async (req, res, next) => {
    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(createError(400, "Invalid video ID"));
        }
        
        // Find video by ID
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(404, "Video not found"));
        }
        
        // Get creator info
        const creator = await User.findById(video.userId, { password: 0 });
        if (!creator) {
            return next(createError(404, "Video creator not found"));
        }
        
        // Combine video with creator data
        const videoData = {
            ...video._doc,
            creator: {
                id: creator._id,
                name: creator.name,
                img: creator.img,
                subscribers: creator.subscribers
            }
        };
        
        res.status(200).json(videoData);
    } catch (err) {
        console.error("Get video error:", err);
        next(err);
    }
};

/**
 * Increment video view count
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const addView = async (req, res, next) => {
    try {
        // Validate video ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(createError(400, "Invalid video ID"));
        }
        
        // Update view count
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!video) {
            return next(createError(404, "Video not found"));
        }
        
        res.status(200).json({ 
            message: "View count increased",
            views: video.views
        });
    } catch (err) {
        console.error("Add view error:", err);
        next(err);
    }
};

/**
 * Get random videos
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of random videos
 */
export const randomVideo = async (req, res, next) => {
    try {
        // Parse limit from query parameters
        const limit = parseInt(req.query.limit) || 40;
        const maxLimit = Math.min(limit, 100); // Cap at 100 videos
        
        // Use MongoDB aggregation to get random videos
        const videos = await Video.aggregate([
            { $match: { status: "public" } }, // Only public videos
            { $sample: { size: maxLimit } }
        ]);
        
        if (!videos || videos.length === 0) {
            return res.status(200).json([]);
        }
        
        // Get creator info for each video
        const videosWithCreator = await Promise.all(
            videos.map(async (video) => {
                const creator = await User.findById(video.userId, { 
                    _id: 1, name: 1, img: 1, subscribers: 1 
                });
                
                return {
                    ...video,
                    creator: creator || { name: "Unknown Creator" }
                };
            })
        );
        
        res.status(200).json(videosWithCreator);
    } catch (err) {
        console.error("Random videos error:", err);
        next(err);
    }
};

/**
 * Get trending videos
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of trending videos
 */
export const trendVideo = async (req, res, next) => {
    try {
        // Parse limit and page from query parameters
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        // Get trending videos (by views)
        const videos = await Video.find({ status: "public" })
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit);
        
        if (!videos || videos.length === 0) {
            return res.status(200).json([]);
        }
        
        // Get creator info for each video
        const videosWithCreator = await Promise.all(
            videos.map(async (video) => {
                const creator = await User.findById(video.userId, { 
                    _id: 1, name: 1, img: 1, subscribers: 1 
                });
                
                return {
                    ...video._doc,
                    creator: creator || { name: "Unknown Creator" }
                };
            })
        );
        
        // Get total count for pagination
        const totalVideos = await Video.countDocuments({ status: "public" });
        
        res.status(200).json({
            videos: videosWithCreator,
            pagination: {
                total: totalVideos,
                page,
                pages: Math.ceil(totalVideos / limit)
            }
        });
    } catch (err) {
        console.error("Trending videos error:", err);
        next(err);
    }
};

/**
 * Get subscription videos
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of subscription videos
 */
export const subscribeVideo = async (req, res, next) => {
    try {
        // Find current user
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        const subscribedChannels = user.subscribedUsers;
        
        // Handle case with no subscriptions
        if (!subscribedChannels || subscribedChannels.length === 0) {
            return res.status(200).json([]);
        }
        
        // Parse limit and page from query parameters
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        
        // Get videos from subscribed channels
        const videos = await Video.find({ 
            userId: { $in: subscribedChannels },
            status: "public"
        })
        .sort({ createdAt: -1 })
        .limit(limit * page); // Get all videos up to the current page
        
        // Get creator info for each video
        const videosWithCreator = await Promise.all(
            videos.map(async (video) => {
                const creator = await User.findById(video.userId, { 
                    _id: 1, name: 1, img: 1, subscribers: 1 
                });
                
                return {
                    ...video._doc,
                    creator: creator || { name: "Unknown Creator" }
                };
            })
        );
        
        res.status(200).json(videosWithCreator);
    } catch (err) {
        console.error("Subscription videos error:", err);
        next(err);
    }
};

/**
 * Get videos by tags
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of videos matching tags
 */
export const getByTag = async (req, res, next) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(",") : [];
        
        if (!tags || tags.length === 0) {
            return next(createError(400, "No tags provided"));
        }
        
        // Parse limit and page from query parameters
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        // Get videos with matching tags
        const videos = await Video.find({ 
            tags: { $in: tags },
            status: "public"
        })
        .sort({ views: -1 }) // Sort by popularity
        .skip(skip)
        .limit(limit);
        
        if (!videos || videos.length === 0) {
            return res.status(200).json([]);
        }
        
        // Get creator info for each video
        const videosWithCreator = await Promise.all(
            videos.map(async (video) => {
                const creator = await User.findById(video.userId, { 
                    _id: 1, name: 1, img: 1, subscribers: 1 
                });
                
                return {
                    ...video._doc,
                    creator: creator || { name: "Unknown Creator" }
                };
            })
        );
        
        // Get total count for pagination
        const totalVideos = await Video.countDocuments({ 
            tags: { $in: tags },
            status: "public"
        });
        
        res.status(200).json({
            videos: videosWithCreator,
            pagination: {
                total: totalVideos,
                page,
                pages: Math.ceil(totalVideos / limit)
            }
        });
    } catch (err) {
        console.error("Get by tags error:", err);
        next(err);
    }
};

/**
 * Search videos by title
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object[]} Array of videos matching search query
 */
export const getBySearch = async (req, res, next) => {
    try {
        const query = req.query.q || "";
        
        if (!query.trim()) {
            return next(createError(400, "Search query is required"));
        }
        
        // Parse limit and page from query parameters
        const limit = parseInt(req.query.limit) || 40;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        // Get videos matching search query
        const videos = await Video.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { videoDescription: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ],
            status: "public"
        })
        .sort({ views: -1 }) // Sort by popularity
        .skip(skip)
        .limit(limit);
        
        if (!videos || videos.length === 0) {
            return res.status(200).json([]);
        }
        
        // Get creator info for each video
        const videosWithCreator = await Promise.all(
            videos.map(async (video) => {
                const creator = await User.findById(video.userId, { 
                    _id: 1, name: 1, img: 1, subscribers: 1 
                });
                
                return {
                    ...video._doc,
                    creator: creator || { name: "Unknown Creator" }
                };
            })
        );
        
        // Get total count for pagination
        const totalVideos = await Video.countDocuments({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { videoDescription: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ],
            status: "public"
        });
        
        res.status(200).json({
            videos: videosWithCreator,
            pagination: {
                total: totalVideos,
                page,
                pages: Math.ceil(totalVideos / limit)
            }
        });
    } catch (err) {
        console.error("Search videos error:", err);
        next(err);
    }
};