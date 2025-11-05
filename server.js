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

const cartRouter = require("./routes/cart.js");
const homeRouter = require("./routes/home.js");
const orderRouter = require("./routes/order.js");
const adminRouter = require("./routes/admin.js");

app.engine("ejs", ejsMate);
// app.use(express.static("views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const dbUrl = "mongodb://127.0.0.1:27017/Dhaba";
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log(res, "connection successfull");
  })
  .catch((err) => console.log(err));

app.use("/", homeRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
