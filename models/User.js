/**
 * User Model
 * MongoDB schema for user information and authentication
 * 
 * @module models/User
 */
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        // Not setting required: true because of Google auth
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't include password in query results by default
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    img: {
        type: String,
        default: 'https://your-aws-s3-bucket.s3.amazonaws.com/default-avatar.png' // Default image on S3
    },
    subscribers: {
        type: Number,
        default: 0,
        min: [0, 'Subscribers cannot be negative']
    },
    subscribedUsers: {
        type: [String],
        default: []
    },
    fromGoogle: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false // Hide from queries by default
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for total videos
UserSchema.virtual('videoCount', {
    ref: 'Video',
    localField: '_id',
    foreignField: 'userId',
    count: true
});

// Ensure password is not returned in JSON responses
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Index for faster search
UserSchema.index({ name: 'text', email: 'text' });

export default mongoose.model("User", UserSchema);