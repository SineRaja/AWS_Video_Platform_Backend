/**
 * User Controller
 * Handles user profile operations and interactions
 * 
 * @module controllers/user
 */
import { createError } from "../utils/error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Update user profile
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Updated user data
 */
export const update = async (req, res, next) => {
    if(req.params.id === req.user.id){
        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },
            { new: true }
            );
            res.status(200).json(updateUser);
        }catch (err){
            next(err);
        }
    }else{
        return next(createError(403, "You can update only your account"));
    }
};

/**
 * Delete user account
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const deleteUser = async (req, res, next) => {
    if(req.params.id === req.user.id){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted.");
        }catch (err){
            next(err);
        }
    }else{
        return next(createError(403, "You can delete only your account"));
    }
};

/**
 * Get user profile
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User data
 */
export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch (err){
        next(err);
    }
};

/**
 * Subscribe to a channel
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const subscribe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id, {
            $push:{subscribedUsers:req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc:{subscribers:1}
        });
        res.status(200).json("Subscription Successful");
    }catch (err){
        next(err);
    }
};

/**
 * Unsubscribe from a channel
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const unSubscribe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id, {
            $pull:{subscribedUsers:req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc:{subscribers: -1}
        });
        res.status(200).json("Unsubscription Successful");
    }catch (err){
        next(err);
    }
};

/**
 * Like a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoid;
    try{
        await Video.findByIdAndUpdate(videoId, {
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        });
        res.status(200).json("Video has been liked");
    }catch (err){
        next(err);
    }
};

/**
 * Dislike a video
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message
 */
export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoid;
    try{
        await Video.findByIdAndUpdate(videoId, {
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        });
        res.status(200).json("Video has been disliked");
    }catch (err){
        next(err);
    }
};