const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  totalAmount: {
    type: Number,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Delivered"],
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
