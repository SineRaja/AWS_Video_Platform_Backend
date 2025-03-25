# Video Platform Deployment on AWS

## Project Overview
This document outlines the deployment process for our video sharing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform allows users to upload, view, and interact with video content.

## Deployment Architecture
The application is deployed on AWS using the following services:
- **EC2**: For hosting the Node.js backend
- **MongoDB**: For database (self-hosted on EC2)
- **Nginx**: As a reverse proxy for handling client requests

## Deployment Steps

### 1. AWS Account Setup
- Created an AWS account
- Set up billing alerts to monitor usage

### 2. EC2 Instance Configuration
- Launched an Ubuntu 22.04 LTS EC2 instance (t2.micro)
- Created and downloaded key pair for SSH access
- Configured security group to allow:
  - SSH (Port 22)
  - HTTP (Port 80)
  - HTTPS (Port 443)
  - Custom application port (8001)

### 3. Server Environment Setup
- Connected to EC2 instance via SSH
- Updated system packages:
  ```
  sudo apt update
  sudo apt upgrade -y
  ```
- Installed Node.js and npm:
  ```
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- Set up MongoDB:
  - Set up Docker for MongoDB
  - Created and configured MongoDB database
- Installed additional required software:
  ```
  sudo apt install -y git nginx
  sudo npm install -g pm2
  ```

### 4. Application Deployment
- Cloned project repository:
  ```
  git clone https://github.com/yourusername/videoplatform.git
  cd videoplatform
  ```
- Installed dependencies:
  ```
  npm install
  ```
- Created environment configuration file:
  ```
  nano .env
  ```
  With the following content:
  ```
  PORT=8001
  NODE_ENV=production
  MONGO=mongodb://localhost:27017/videoplatform
  JWT=your_secret_key
  ```
- Started application with PM2:
  ```
  pm2 start index.js --name "videoplatform"
  pm2 startup
  pm2 save
  ```

### 5. Nginx Configuration
- Created Nginx site configuration:
  ```
  sudo nano /etc/nginx/sites-available/videoplatform
  ```
- Added configuration for reverse proxy:
  ```nginx
  server {
      listen 80;
      server_name 16.171.12.180;  # Server IP address

      location / {
          proxy_pass http://localhost:8001;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
  }
  ```
- Enabled the site and restarted Nginx:
  ```
  sudo ln -s /etc/nginx/sites-available/videoplatform /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  ```

### 6. Testing and Verification
- Confirmed application is running:
  ```
  pm2 status
  pm2 logs
  ```
- Tested API endpoints using Postman:
  - `POST http://16.171.12.180/api/auth/signup` (User registration)
  - `POST http://16.171.12.180/api/auth/signin` (User login)
  - Other endpoints as needed

## Maintenance Procedures

### Application Updates
To update the application:
```
cd ~/videoplatform
git pull
npm install
pm2 restart videoplatform
```

### Monitoring
- Application monitoring:
  ```
  pm2 monit
  ```
- Server resource monitoring:
  ```
  htop
  ```
- Log monitoring:
  ```
  pm2 logs
  sudo tail -f /var/log/nginx/error.log
  ```

### Backup Procedures
- Database backups:
  ```
  mongodump --out ~/backups/$(date +%Y-%m-%d)
  ```
- Consider setting up automated backups with cron

## Troubleshooting

### Common Issues
- **404 Not Found**: Check Nginx configuration and API routes
- **Connection refused**: Verify application is running and port is open
- **Database connection errors**: Check MongoDB is running and credentials are correct

### Debugging Steps
1. Check application logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify services are running: `sudo systemctl status nginx`
4. Test API directly: `curl -X GET http://localhost:8001/api/health`

## Security Considerations
- Keep Ubuntu and application dependencies updated
- Use strong passwords and secure JWT secret
- Consider implementing rate limiting
- Set up SSL/TLS certificates for HTTPS

## Future Improvements
- Add HTTPS support with Let's Encrypt
- Set up a CDN for static assets
- Implement containerization with Docker
- Configure auto-scaling for handling increased traffic
- Migrate to managed MongoDB service (MongoDB Atlas)

---

This deployment provides a robust foundation for our video platform, ensuring high availability and performance while maintaining security and scalability for future growth.

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

