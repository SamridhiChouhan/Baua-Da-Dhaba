const express = require("express");
const router = express.Router();
const { validateFood, validateId } = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const Food = require("../models/food.js");
const Order = require("../models/order.js");

// Order checkout
router.get("/checkout", async (req, res) => {
  let user = await User.findOne({ _id: req.user._id });
  let cart = await Cart.findOne({ user: user._id })
    .populate("user")
    .populate("cart.food");

  let foodCart = cart.cart;
  let totalAmount = 0;

  for (item of foodCart) {
    // console.log(item.price);
    totalAmount += Number(item.food.price);
  }
  res.render("checkout", { totalAmount, user });
});

// Order confirmation
router.post(
  "/ordersuccess",
  wrapAsync(async (req, res) => {
    let { address } = req.body;
    let user = await User.findOne({ _id: req.user._id });

    user.address.push(address);
    let updatedUser = await user.save();

    let cart = await Cart.findOne({ user: user._id }).populate("cart.food");
    let foodIds = cart.cart.map((item) => item.food._id);
    let userCart = cart.user;
    let foodCart = cart.cart;
    let totalAmount = 0;

    for (item of foodCart) {
      totalAmount += Number(item.food.price);
    }

    let order = new Order({
      user: cart.user,
      items: foodIds,
      totalAmount: totalAmount,
    });

    await order.save();

    cart.cart = [];
    await cart.save();

    res.render("orderSuccess");
  })
);

// Order history
router.get("/orderhistory", async (req, res) => {
  let user = await User.findOne({ _id: req.user._id });
  let orders = await Order.find({ user: user._id }).populate("items");
  console.log(orders);
  res.render("orderhistory", { orders });
});

module.exports = router;
