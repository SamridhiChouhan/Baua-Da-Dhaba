const express = require("express");
let app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

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

const sessioOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessioOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.action = req.flash("action");
  res.locals.currUser = req.user || null;
  next();
});

app.use("/", homeRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);

app.get("/user/signup", (req, res) => {
  res.render("user/signup");
});

app.post("/user/signup", async (req, res) => {
  try {
    let { username, email, role, password } = req.body;
    const newUser = new User({ email, username, role });
    const registeredUser = await User.register(newUser, password);
    req.logIn(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to Baua Da Dhabaa!");
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/signup");
  }
});

app.get("/user/login", (req, res) => {
  res.render("user/login");
});

app.post(
  "/user/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Baua Da Dhabaa! You are Logged in!");
    res.redirect("/");
  }
);

app.get("/user/logout", async (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/");
  });
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("./extra/error", { message });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
