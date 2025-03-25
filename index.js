/**
 * Main Server Application
 * Entry point for the Video Platform API
 * 
 * @module index
 */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comment.js';
import authenticationRoutes from './routes/authentications.js';
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { errorHandler } from "./utils/error.js";

// Load environment variables
dotenv.config();

const app = express();

// Define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Increase the limit for event listeners to prevent warnings
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15;

const connect = () => {
    mongoose
        .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected To Database");
        })
        .catch((err) => { 
            console.error("MongoDB connection error:", err);
            // Don't retry immediately, to prevent event listener buildup
            setTimeout(() => {
                console.log("Retrying database connection...");
                connect();
            }, 5000);
        });
}; 

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authenticationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comment", commentRoutes);

// Global error handler
app.use(errorHandler);

// Correctly serve static files
app.use(express.static(path.resolve(__dirname, "client", "build")));

// Correct catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Single server instance to avoid resource leaks
let server;

const startServer = () => {
    // Close existing server if it exists
    if (server) {
        server.close();
    }
    
    // Start a new server
    const PORT = process.env.PORT || 8001;
    server = app.listen(PORT, () => {
        connect();
        console.log(`Connected to server on port ${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
        console.error('Server error:', error);
    });
};

// Start the server
startServer();

// Handle cleanup properly
process.on('SIGINT', () => {
    console.log('Gracefully shutting down from SIGINT (Ctrl+C)');
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Only have one uncaught exception handler
process.removeAllListeners('uncaughtException');
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

export default app;