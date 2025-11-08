const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post("/signup", async (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Baua Da Dhabaa! You are Logged in!");
    res.redirect("/");
  }
);

router.get("/logout", async (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/");
  });
});

module.exports = router;
