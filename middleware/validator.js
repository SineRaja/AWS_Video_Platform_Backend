/**
 * Input Validation Middleware
 * Common validation rules for API routes
 * 
 * @module middleware/validator
 */
import { body, param, query, validationResult } from 'express-validator';
import { createError } from '../utils/error.js';

/**
 * Validate request body, parameters, or query
 * @param {Function} validations - Array of validation rules
 * @returns {Function} Express middleware
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Forward validation errors
    return next(createError(400, "Validation error", errors.array()));
  };
};

/**
 * User validation rules
 */
export const userValidation = {
  create: [
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
      .withMessage('Password must be 8-24 characters with uppercase, lowercase, number and special character')
  ],
  update: [
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
    body('img')
      .optional()
      .trim()
      .isURL().withMessage('Profile image must be a valid URL')
  ]
};

/**
 * Video validation rules
 */
export const videoValidation = {
  create: [
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
      .custom(value => value.length <= 20).withMessage('Cannot have more than 20 tags')
  ],
  search: [
    query('q')
      .notEmpty().withMessage('Search query is required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
  ]
};

/**
 * Comment validation rules
 */
export const commentValidation = {
  create: [
    body('videoId')
      .notEmpty().withMessage('Video ID is required')
      .isMongoId().withMessage('Invalid video ID format'),
    body('comment')
      .trim()
      .notEmpty().withMessage('Comment text is required')
      .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
  ]
};

export default {
  validate,
  userValidation,
  videoValidation,
  commentValidation
};