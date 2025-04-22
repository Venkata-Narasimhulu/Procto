const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create new schema for website user (professor or student)
// userType is true if professor else false
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  collegeId: {
    type: String,
    required: true // make optional if needed
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: Boolean,
    required: false
  }
});

// Export the model
module.exports = User = mongoose.model("users", UserSchema);
