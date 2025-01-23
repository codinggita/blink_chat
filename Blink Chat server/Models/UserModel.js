import mongoose from "mongoose"; // Import Mongoose to define the schema and interact with MongoDB
import bcrypt from "bcrypt"; // Import bcrypt for password hashing


// Define a schema for the User model
const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required : [true, "Email is required"],
        unique : true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false
    },
});


// Pre-save middleware to hash the password before saving a user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt with a strength of 10.
      this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt.
      next();
    } catch (error) {
      next(error);
    }
  });

  
// Create the User model using the schema
const User = mongoose.model("Users", userSchema);

export default User;