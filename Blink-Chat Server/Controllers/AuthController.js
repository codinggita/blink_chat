import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {renameSync, unlinkSync} from 'fs'

// This the age of JWT token that means token is valid for maxAge (Here 3 days.)
const maxAge = 3 * 24 * 60 * 60 * 1000 ;

// Creating a JWT token.
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};


// This is code of Signup Logic that handles user's Signup
export const signup = async (request, response) => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        return response.status(400).json({ message: "Email and password are required" });
      }
  
      console.log("Original Password:", password);
  
      // Save the user directly without manually hashing the password
      const user = await User.create({ email, password });
      console.log("User Saved:", user);
  
      // Set the JWT token as a cookie
      response.cookie('jwt', createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });
  
      response.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send("Internal server error");
    }
  };
  