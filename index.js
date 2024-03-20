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

dotenv.config();

const app = express()

// Define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connect = () => {
    mongoose
        .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected To Database");
        })
        .catch((err) => { 
            throw err;
        });
}; 

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authenticationRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comment", commentRoutes)

app.use((err, req, res, next)=> {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message
    })
})

// Correctly serve static files
app.use(express.static(path.resolve(__dirname, "client", "build")));

// Correct catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(8001, () => {
    connect()
    console.log("Connected! to server")
})
