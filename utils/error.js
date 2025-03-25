/**
 * Error Handling Utility
 * Creates standardized error objects and handles error responses
 * 
 * @module utils/error
 */

/**
 * Create a standardized error object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {Array|Object} [errors] - Additional error details
 * @returns {Error} Standardized error object
 */
export const createError = (status, message, errors = null) => {
    const err = new Error(message);
    err.status = status;
    err.message = message;
    
    if (errors) {
      err.errors = errors;
    }
    
    return err;
  };
  
  /**
   * Global error handler middleware
   * @param {Error} err - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {Object} Error response
   */
  export const errorHandler = (err, req, res, next) => {
    // Get status code and message
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    
    // Log error appropriately based on environment
    if (process.env.NODE_ENV === 'production') {
      console.error(`Error ${status}: ${message}`);
      
      // Log request information for debugging
      console.error({
        path: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    } else {
      // In development, log full error
      console.error('API Error:', err);
    }
    
    // Customize response based on error type
    let response = {
      success: false,
      status,
      message
    };
    
    // Add validation errors if available
    if (err.errors) {
      response.errors = err.errors;
    }
    
    // Add request ID for tracking if available
    if (req.id) {
      response.requestId = req.id;
    }
    
    return res.status(status).json(response);
  };
  
  /**
   * Custom async handler to avoid try-catch blocks
   * @param {Function} fn - Async function to handle
   * @returns {Function} Express middleware
   */
  export const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  export default {
    createError,
    errorHandler,
    asyncHandler
  };