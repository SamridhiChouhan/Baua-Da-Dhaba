const mongoose = require("mongoose");
const { Schema } = mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  address: [
    {
      type: String,
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
