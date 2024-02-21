const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
        type: String
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
  }, 
  { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;