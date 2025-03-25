/**
 * File Upload Middleware
 * Handles image and video uploads to AWS S3
 * 
 * @module middleware/upload
 */
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../utils/error.js';
import { uploadToS3 } from '../config/aws.js';

// Memory storage for processing uploads before sending to S3
const storage = multer.memoryStorage();

// File size limits
const fileSize = {
  image: 5 * 1024 * 1024, // 5MB
  video: 500 * 1024 * 1024 // 500MB
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(createError(400, 'Only image files are allowed'), false);
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mpeg|webm|mov|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(createError(400, 'Only video files are allowed'), false);
  }
};

// Multer configurations
export const uploadImage = multer({
  storage,
  limits: { fileSize: fileSize.image },
  fileFilter: imageFilter
}).single('image');

export const uploadVideo = multer({
  storage,
  limits: { fileSize: fileSize.video },
  fileFilter: videoFilter
}).single('video');

/**
 * Process image upload to S3
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const processImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `images/${uuidv4()}${fileExt}`;

    // Upload to S3
    const result = await uploadToS3(
      req.file.buffer,
      fileName,
      req.file.mimetype
    );

    if (!result.success) {
      return next(createError(500, 'Error uploading image to S3'));
    }

    // Add image URL to request body
    req.body.imgURL = result.url;
    next();
  } catch (error) {
    next(createError(500, 'File upload processing error'));
  }
};

/**
 * Process video upload to S3
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const processVideoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `videos/${uuidv4()}${fileExt}`;

    // Upload to S3
    const result = await uploadToS3(
      req.file.buffer,
      fileName,
      req.file.mimetype
    );

    if (!result.success) {
      return next(createError(500, 'Error uploading video to S3'));
    }

    // Add video URL to request body
    req.body.videoUrl = result.url;
    next();
  } catch (error) {
    next(createError(500, 'File upload processing error'));
  }
};

export default {
  uploadImage,
  uploadVideo,
  processImageUpload,
  processVideoUpload
};