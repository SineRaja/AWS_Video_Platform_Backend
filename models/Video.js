/**
 * Video Model
 * MongoDB schema for video content
 * 
 * @module models/Video
 */
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true // Add index for faster queries by userId
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    videoDescription: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    imgURL: {
        type: String,
        required: [true, 'Thumbnail image URL is required'],
        validate: {
            validator: function(v) {
                // Basic URL validation
                return /^(https?|s3):\/\/\S+/.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
        validate: {
            validator: function(v) {
                // Basic URL validation
                return /^(https?|s3):\/\/\S+/.test(v);
            },
            message: props => `${props.value} is not a valid video URL!`
        }
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.length <= 20; // Limit to 20 tags
            },
            message: props => 'Cannot have more than 20 tags'
        }
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public'
    },
    duration: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for comments count
VideoSchema.virtual('commentCount', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'videoId',
    count: true
});

// Indexes for faster queries
VideoSchema.index({ title: 'text', videoDescription: 'text', tags: 'text' }); // Text search index
VideoSchema.index({ views: -1 }); // For trending videos
VideoSchema.index({ createdAt: -1 }); // For newest videos
VideoSchema.index({ userId: 1, createdAt: -1 }); // For user's videos by date

// Calculate engagement rate
VideoSchema.methods.getEngagementRate = function() {
    const totalEngagements = this.likes.length + this.dislikes.length;
    return this.views > 0 ? (totalEngagements / this.views) * 100 : 0;
};

export default mongoose.model("Video", VideoSchema);