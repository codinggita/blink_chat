import { Router } from "express";


import {signup, login, getUserInfo}  from "../controllers/AuthController.js"; // Import the signup controller function from the controllers Folder.

import { verifyToken } from "../middleware/AuthMiddleware.js";

const authRoutes = Router(); // Initialize a new router instance

authRoutes.post("/signup", signup); // Define a POST route for "/signup" that calls the signup Function.
authRoutes.post("/login", login); // Define a POST route for "/Login" that calls the login Function.
authRoutes.get('/user-info', verifyToken, getUserInfo) // Define a GET route for "/user-info" that calls the getUserInfo Function and requires a valid JWT token to verify the user.


export default authRoutes; // // Export the router to use it in other parts of the application
