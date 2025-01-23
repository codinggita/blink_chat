import { Router } from "express";


import {signup, login}  from "../controllers/AuthController.js"; // Import the signup controller function from the controllers Folder.

const authRoutes = Router(); // Initialize a new router instance

authRoutes.post("/signup", signup); // Define a POST route for "/signup" that calls the signup Function.
authRoutes.post("/login", login); // Define a POST route for "/Login" that calls the login Function.


export default authRoutes; // // Export the router to use it in other parts of the application
