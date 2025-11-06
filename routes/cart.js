const express = require("express");
const router = express.Router();
const { validateFood, validateId } = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const Food = require("../models/food.js");

// show cart
router.get("/", async (req, res) => {
  let user = await User.findOne({ email: "user1@" });
  let cart = await Cart.findOne({ user: user._id })
    .populate("user")
    .populate("cart.food");

  let userCart = cart.user;
  let foodCart = cart.cart;
  let totalAmount = 0;

  for (item of foodCart) {
    // console.log(item.price);
    totalAmount += Number(item.food.price);
  }

  if (foodCart.length === 0) {
    req.flash("error", "Cart is empty!");
  }

  // console.log(cart.cart);
  res.render("cart", { cart, userCart, foodCart, totalAmount });
});

// Add items in cart
router.post(
  "/add/:id",
  validateId,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let food = await Food.findById(id);
    let user = await User.findOne({ email: "user1@" });
    let cart = await Cart.findOne({ user: user._id });
    console.log(cart);

    if (!cart) {
      cart = new Cart({ user: user._id, cart: [] });
    }
    cart.cart.push({
      food: food._id,
    });

    await cart.save();
    req.flash("action", "Item added!");
    // res.redirect("/");
    // res.json({ redirect: "/cart" }); // send redirect path
    console.log(cart);
  })
);

// cart item delete
router.delete(
  "/:id",
  validateId,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let user = await User.findOne({ email: "user1@" });
    console.log("user:", user);
    let items = await Cart.findOneAndUpdate(
      { user: user._id },
      { $pull: { cart: { _id: id } } }
    );
    console.log("items:", items);
    res.redirect("/cart");
  })
);

module.exports = router;
