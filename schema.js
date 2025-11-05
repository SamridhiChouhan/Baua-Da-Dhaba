const joi = require("joi");

const foodValidationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.object().allow("", null),
  price: joi.number().required().min(1),
  category: joi.string().required(),
});

const orderValidationSchema = joi.object({});

// for adding new item in cart
// For basically checking if id is correct
const idSchema = joi.object({
  id: joi.string().length(24).hex().required(), // MongoDB ObjectId
});

module.exports = { foodValidationSchema, idSchema };
