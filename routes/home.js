const express = require("express");
const router = express.Router();
const Food = require("../models/food.js");

// show menu
router.get("/", async (req, res) => {
  const foodList = await Food.find({});
  res.render("index", { foodList });
});

router.get("/menu", async (req, res) => {
  const foodList = await Food.find({});
  res.render("menu", { foodList });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
