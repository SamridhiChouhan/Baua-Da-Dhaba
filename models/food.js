const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
    // required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [],
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
