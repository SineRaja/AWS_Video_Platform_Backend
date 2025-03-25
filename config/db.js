/**
 * Database Configuration
 * Handles MongoDB connection with retry logic
 * 
 * @module config/db
 */
import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
export const connectDB = () => {
  const connectWithRetry = () => {
    mongoose
      .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      })
      .then(() => {
        console.log("Connected to MongoDB database");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB, retrying in 5 seconds...", err);
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();
};

export default connectDB;