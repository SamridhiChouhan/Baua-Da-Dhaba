const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Delivered"],
    default: "Pending",
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
