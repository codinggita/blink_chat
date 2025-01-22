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

