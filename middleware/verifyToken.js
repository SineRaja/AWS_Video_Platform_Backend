/**
 * JWT Token Verification Middleware
 * Authenticates and authorizes API requests
 * 
 * @module middleware/verifyToken
 */
import jwt from "jsonwebtoken";
import { createError } from '../utils/error.js';

/**
 * Verify JWT token in cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return next(createError(401, "Authentication required"));
    }
    
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        // Handle different JWT error types
        if (err.name === 'TokenExpiredError') {
          return next(createError(401, "Token has expired"));
        } else if (err.name === 'JsonWebTokenError') {
          return next(createError(401, "Invalid token"));
        } else {
          return next(createError(401, "Token validation failed"));
        }
      }
      
      // Attach user data to request object
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error);
    next(createError(500, "Authentication error"));
  }
};

/**
 * Optional token verification - doesn't require authentication
 * but attaches user data if token is present and valid
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const optionalVerifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return next();
    }
    
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (!err) {
        // Attach user data to request object
        req.user = user;
      }
      next();
    });
  } catch (error) {
    // Continue without authentication
    next();
  }
};