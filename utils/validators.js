/**
 * Common Validation Functions
 * Reusable validation logic for the application
 * 
 * @module utils/validators
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email format is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with success and message
   */
  export const validatePassword = (password) => {
    // Check if password exists
    if (!password) {
      return {
        isValid: false,
        message: 'Password is required'
      };
    }
  
    // Check password length
    if (password.length < 8 || password.length > 24) {
      return {
        isValid: false,
        message: 'Password must be between 8 and 24 characters'
      };
    }
  
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
  
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }
  
    // Check for number
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }
  
    // Check for special character
    if (!/[!@#$%^&*_=+-]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character (!@#$%^&*_=+-)'
      };
    }
  
    return {
      isValid: true,
      message: 'Password is valid'
    };
  };
  
  /**
   * Validate MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {boolean} Whether the ID is a valid MongoDB ObjectId
   */
  export const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  };
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Whether the URL format is valid
   */
  export const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Sanitize object by removing specified fields
   * @param {Object} obj - Object to sanitize
   * @param {string[]} fields - Fields to remove
   * @returns {Object} Sanitized object
   */
  export const sanitizeObject = (obj, fields = []) => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
  
    const sanitized = { ...obj };
    
    fields.forEach(field => {
      delete sanitized[field];
    });
    
    return sanitized;
  };
  
  export default {
    isValidEmail,
    validatePassword,
    isValidObjectId,
    isValidURL,
    sanitizeObject
  };