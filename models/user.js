const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ["User", "Admin", "Staff"],
    default: "User",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
