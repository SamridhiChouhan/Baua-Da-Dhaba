const express = require("express");
const router = express.Router();
const { validateFood, validateId, isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Food = require("../models/food.js");
const Order = require("../models/order.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

//show Admin dashboard
router.get("/", isLoggedIn, async (req, res) => {
  let foodList = await Food.find({});
  // console.log(foodList);
  if (req.user.role != "Staff" && req.user.role != "Admin") {
    req.flash("error", `You don't have access to this page`);
    return res.redirect("/");
  }
  // console.log(req.user.role);
  req.flash("success", `${req.user.username} logged in!!`);
  res.render("adminDashboard", { foodList });
});

// Render addNewFood form
router.get("/add", async (req, res) => {
  res.render("new");
});

// Add new Food
router.post(
  "/add",
  validateFood,
  wrapAsync(async (req, res) => {
    let { title, description, image, price, category } = req.body;
    let newFood = new Food(req.body);
    await newFood.save();
    console.log(newFood);
    req.flash("success", "New food-item added!");
    res.redirect("/admin");
  })
);

// Render editFood form
router.get("/edit/:id", async (req, res) => {
  let { id } = req.params;
  let food = await Food.findById(id);
  if (!food) {
    throw new ExpressError(404, "Food doesn't exist with this id!");
  }
  console.log(food);
  res.render("edit", { food });
});

// edit food
router.patch(
  "/edit/:id",
  validateFood,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, category } = req.body;
    let food = await Food.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    req.flash("success", `${title} edited successfully!`);
    res.redirect("/admin");
  })
);

// Delete foodItem
router.delete(
  "/delete/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let food = await Food.findOneAndDelete({ _id: id });
    console.log(food);
    req.flash("success", `${food.title} deleted successfully!`);
    res.redirect("/admin");
  })
);

// to add staffform
router.get("/staff", async (req, res) => {
  if (req.user.role != "Admin") {
    req.flash("error", "Only Admin have access to this page!");
    console.log(req.user.role);
    return res.redirect("/admin");
  }
  res.render("staff");
});

// cHange role
router.post("/staff", async (req, res) => {
  let { email, username, role } = req.body;
  let user = await User.findOneAndUpdate(
    { username: username },
    { role: role }
  );
  if (!user) {
    req.flash("error", "No user found with this username. Login first!!");
    return res.redirect("/user/login");
  }

  req.flash("success", `${username} role is changed to ${role}`);
  res.redirect("/admin");
});

// show staff
router.get("/staffView", async (req, res) => {
  let users = await User.find({ role: "Staff" });
  res.render("staffView", { users });
});

// order list
router.get("/orders", async (req, res) => {
  let orders = await Order.find({}).populate("items");
  console.log(orders);

  res.render("order", { orders });
});

// render edit order status form
router.get("/order/edit/:id", async (req, res) => {
  let { id } = req.params;
  let order = await Order.findById(id).populate("items");
  // let items = order.items;
  console.log(order);
  res.render("orderStatus", { order });
});

// Edit order status
router.patch(
  "/order/edit/:id",
  wrapAsync(async (req, res) => {
    let { status } = req.body;
    let { id } = req.params;
    let order = await Order.findOneAndUpdate(
      { _id: id },
      {
        status: status,
      }
    );
    // let items = order.items;
    console.log(order);
    res.redirect("/admin/orders");
  })
);

module.exports = router;
