import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {renameSync, unlinkSync} from 'fs'


// This is a age of JWT token (here token is valid for 3 days).
const maxAge = 3 * 24 * 60 * 60 * 1000;


// This is a function to generate JWT token.
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};
