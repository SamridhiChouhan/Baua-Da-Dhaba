const express = require("express");
const router = express.Router();
const { validateFood, validateId } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Food = require("../models/food.js");
const Order = require("../models/order.js");

//show Admin dashboard
router.get("/", async (req, res) => {
  let foodList = await Food.find({});
  // console.log(foodList);
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
    req.flash("error", "Food doesn't exist with this id!");
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
    res.redirect("/admin");
  })
);

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
