import express from "express";
import dotenv from "dotenv"; // Import dotenv to manage environment variables
import mongoose from "mongoose";
import cors from "cors"; // Import CORS middleware to handle cross-origin requests

dotenv.config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT; // Get the server port from environment variables
const databaseURL = process.env.DATABASE_URL; // Get the MongoDB URL from environment variables


// Configure CORS middleware
app.use(
  cors({
    origin: [process.env.ORIGIN],  // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


// Define routes for authentication
app.use('/api/auth', authRoutes)

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Connect to MongoDB using Mongoose
mongoose
  .connect(databaseURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Database connection error:", error));