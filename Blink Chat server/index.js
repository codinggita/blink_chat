import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import path from "path";
import contactRoute from "./routes/SearchContactsRoutes.js";
import setupSocket from "./socket.js";
import messagesRoute from "./routes/SearchMessaesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN], // Ensure the frontend origin is correctly set in the .env file
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use('/uploads/profiles', express.static(path.join(process.cwd(), 'uploads/profiles'))); // Serves static profile images

app.use(cookieParser());
app.use(express.json()); // Parses incoming JSON requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/searchContact', contactRoute);
app.use('/api/searchMessages', messagesRoute);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setupSocket(server); // Initialize WebSocket connections

mongoose
  .connect(databaseURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Database connection error:", error)); // Log database connection errors
