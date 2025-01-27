import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { renameSync, unlinkSync } from 'fs'


// This is a age of JWT token (here token is valid for 3 days).
const maxAge = 3 * 24 * 60 * 60 * 1000;


// This is a function to generate JWT token.
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};


// This is a function to manage signup that done by new User.
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


// This is a function to manage Login that done by existing User.
export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    console.log("Login Request - Email:", email);
    console.log("Login Request - Password:", password);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return response.status(404).json({ message: "User with the given Email not found" });
    }

    console.log("User Found:", user);
    console.log("Hashed Password from DB:", user.password);

    // Compare the password
    const auth = await bcrypt.compare(password, user.password);
    console.log("Password Comparison Result:", auth);

    if (!auth) {
      return response.status(400).json({ message: "Password is incorrect" });
    }

    // Set the JWT token as a cookie that is valid for 3 days
    response.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal server error");
  }
};


// This is a function to get all user info (After some time i use this user data in my frontend to set or modify existing user data.)
export const getUserInfo = async (request, response) => {
  try {
    // Fetch user data using `request.userId` (set in the middleware)
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).json({ message: "User with the given Id not found" });
    }

    response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error");
  }
};


// updateProfile function is used to find user by id and update all userdata that we define in our user model.(User update it's profile in the profile setup frontend) 
export const updateProfile = async (request, response) => {
  try {
    const { userId } = request
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName || !color) {
      return response.status(400).json({ message: "Firstname lastname and color are required" });
    }

    const userData = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true })

    response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error");
  }
};
