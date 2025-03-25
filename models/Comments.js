/**
 * Comments Model
 * MongoDB schema for video comments
 * 
 * @module models/Comments
 */
import mongoose from "mongoose";

const VideoCommentsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true // Add index for faster queries by userId
        },
        videoId: {
            type: String,
            required: true,
            index: true // Add index for faster queries by videoId
        },
        comment: {
            type: String,
            required: true,
            trim: true, // Automatically remove whitespace
            maxlength: [1000, 'Comment cannot be more than 1000 characters']
        }
    }, 
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Enable virtuals in JSON output
        toObject: { virtuals: true } // Enable virtuals in object output
    }
);

// Add a compound index for videoId + userId for faster querying of user's comments on specific videos
VideoCommentsSchema.index({ videoId: 1, userId: 1 });

export default mongoose.model("Comments", VideoCommentsSchema);