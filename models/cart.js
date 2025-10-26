const mongoose = require("mongoose");
const User = require("./user");
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cart: [
    {
      // id: {
      //   type: String,
      // },
      food: {
        type: Schema.Types.ObjectId,
        ref: "Food",
      },
      quantity: {
        type: Number,
        min: 1,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
