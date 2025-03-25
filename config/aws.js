/**
 * AWS Configuration
 * Setup for AWS S3 storage for video and image uploads
 * 
 * @module config/aws
 */
import AWS from 'aws-sdk';

// Configure AWS with credentials from environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Create S3 service object
const s3 = new AWS.S3();

/**
 * Upload file to S3
 * @param {Buffer} fileContent - File content buffer
 * @param {string} fileName - Name to save the file as
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<Object>} Upload result with file URL
 */
export const uploadToS3 = async (fileContent, fileName, contentType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params).promise();
    return {
      success: true,
      url: data.Location,
      key: data.Key
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete file from S3
 * @param {string} fileKey - S3 file key to delete
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey
  };

  try {
    await s3.deleteObject(params).promise();
    return {
      success: true
    };
  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  s3,
  uploadToS3,
  deleteFromS3
};