const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: String,
  },
  category: {
    type: String,
    enum: [],
  },
  available: {
    type: Boolean,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
