# Video Platform API

A MERN stack video sharing platform API with comprehensive features for user authentication, video management, comments, and social interactions.

## Features

- User authentication (signup, login, Google authentication)
- Video uploading, management, and streaming
- Comments and interactions (likes, dislikes)
- Channel subscriptions
- Search and discovery features
- AWS S3 integration for file storage

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Frontend** (not included): React.js

## Project Structure

```
video-platform/
│
├── client/                     # React frontend (build files for production)
│
├── config/                     # Configuration files
│   ├── db.js                   # Database connection configuration
│   └── aws.js                  # AWS S3 configuration for uploads
│
├── controllers/                # Business logic
│   ├── authentication.js       # Authentication logic
│   ├── comment.js              # Comment operations
│   ├── user.js                 # User profile operations
│   └── video.js                # Video operations
│
├── middleware/                 # Custom middleware
│   ├── verifyToken.js          # Token verification
│   ├── validator.js            # Input validation rules
│   └── upload.js               # File upload middleware
│
├── models/                     # MongoDB schemas
│   ├── Comments.js             # Comment model
│   ├── User.js                 # User model
│   └── Video.js                # Video model
│
├── routes/                     # API routes
│   ├── authentications.js      # Auth routes
│   ├── comment.js              # Comment routes
│   ├── users.js                # User routes
│   └── videos.js               # Video routes
│
├── utils/                      # Utility functions
│   ├── error.js                # Error handling
│   ├── logger.js               # Logging utility
│   └── validators.js           # Common validation functions
│
├── logs/                       # Application logs (created at runtime)
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment variables
├── index.js                    # Main application entry point
└── package.json                # Dependencies and scripts
```

## API Documentation

### Authentication

```
POST /api/auth/signup      # Register a new user
POST /api/auth/signin      # Login an existing user
POST /api/auth/google      # Authenticate with Google
POST /api/auth/logout      # Logout a user
```

### User Management

```
PUT    /api/users/:id          # Update user details
DELETE /api/users/:id          # Delete a user account
GET    /api/users/find/:id     # Get user information
PUT    /api/users/sub/:id      # Subscribe to a channel
PUT    /api/users/unsub/:id    # Unsubscribe from a channel
PUT    /api/users/like/:videoid    # Like a video
PUT    /api/users/dislike/:videoid # Dislike a video
```

### Video Management

```
POST   /api/videos/            # Create a new video
PUT    /api/videos/:id         # Update a video
DELETE /api/videos/:id         # Delete a video
GET    /api/videos/find/:id    # Get a specific video
PUT    /api/videos/view/:id    # Add a view to a video
GET    /api/videos/trendvideo  # Get trending videos
GET    /api/videos/randomvideo # Get random videos
GET    /api/videos/subscribevideos  # Get videos from subscribed channels
GET    /api/videos/tags        # Get videos by tags
GET    /api/videos/search      # Search videos by title
```

### Comments

```
POST   /api/comment/           # Add a comment to a video
GET    /api/comment/:videoId   # Get all comments for a video
DELETE /api/comment/:id        # Delete a comment
```

## Setup Instructions

### Prerequisites

- Node.js (14.x or later)
- MongoDB Atlas account or local MongoDB
- AWS account with S3 bucket (for file storage)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/video-platform.git
   cd video-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in the environment variables in the `.env` file

5. Start the development server:
   ```bash
   npm run dev
   ```

## AWS Deployment

For AWS deployment instructions, please refer to the detailed AWS deployment guide in the documentation.

