const express = require("express");
let app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Food = require("./models/food");
const User = require("./models/user");
const Cart = require("./models/cart");
const Order = require("./models/order");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { validateFood, validateId } = require("./middleware.js");
const { foodValidationSchema } = require("./schema.js");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.engine("ejs", ejsMate);
app.use(express.static("views"));

app.use(express.static(path.join(__dirname, "public")));

const dbUrl = "mongodb://127.0.0.1:27017/Dhaba";
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log(res, "connection successfull");
  })
  .catch((err) => console.log(err));

// show menu
app.get("/", async (req, res) => {
  const foodList = await Food.find({});
  res.render("index", { foodList });
});

app.get("/menu", async (req, res) => {
  const foodList = await Food.find({});
  res.render("menu", { foodList });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// show cart
app.get("/cart", async (req, res) => {
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

  // console.log(cart.cart);
  res.render("cart", { cart, userCart, foodCart, totalAmount });
});

// Add items in cart
app.post(
  "/cart/add/:id",
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
    console.log(cart);
  })
);

// cart item delete
app.delete(
  "/cart/:id",
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

// Order checkout
app.get("/checkout", async (req, res) => {
  let user = await User.findOne({ email: "user1@" });
  let cart = await Cart.findOne({ user: user._id })
    .populate("user")
    .populate("cart.food");

  let foodCart = cart.cart;
  let totalAmount = 0;

  for (item of foodCart) {
    // console.log(item.price);
    totalAmount += Number(item.food.price);
  }
  res.render("checkout", { totalAmount });
});

// Order confirmation
app.post(
  "/ordersuccess",
  wrapAsync(async (req, res) => {
    let { address } = req.body;
    let user = await User.findOne({ email: "user1@" });

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
app.get("/orderhistory", async (req, res) => {
  let user = await User.findOne({ email: "user1@" });
  let orders = await Order.find({ user: user._id }).populate("items");
  console.log(orders);
  res.render("orderhistory", { orders });
});

//show Admin dashboard
app.get("/admin", async (req, res) => {
  let foodList = await Food.find({});
  // console.log(foodList);
  res.render("adminDashboard", { foodList });
});

// Render addNewFood form
app.get("/admin/add", async (req, res) => {
  res.render("new");
});

// Add new Food
app.post(
  "/admin/add",
  validateFood,
  wrapAsync(async (req, res) => {
    let { title, description, image, price, category } = req.body;
    let newFood = new Food(req.body);
    await newFood.save();
    console.log(newFood);
    res.redirect("/admin");
  })
);

// Render editFood form
app.get("/admin/edit/:id", async (req, res) => {
  let { id } = req.params;
  let food = await Food.findById(id);
  console.log(food);
  res.render("edit", { food });
});

// edit food
app.patch(
  "/admin/edit/:id",
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
app.delete(
  "/admin/delete/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let food = await Food.findOneAndDelete({ _id: id });
    console.log(food);
    res.redirect("/admin");
  })
);

// order list
app.get("/admin/orders", async (req, res) => {
  let orders = await Order.find({}).populate("items");
  console.log(orders);

  res.render("order", { orders });
});

// render edit order status form
app.get("/admin/order/edit/:id", async (req, res) => {
  let { id } = req.params;
  let order = await Order.findById(id).populate("items");
  // let items = order.items;
  console.log(order);
  res.render("orderStatus", { order });
});

// Edit order status
app.patch(
  "/admin/order/edit/:id",
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

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
  // res.status(statusCode).send("error : ", message);
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
