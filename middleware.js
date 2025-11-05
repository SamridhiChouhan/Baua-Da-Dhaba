const { foodValidationSchema, idSchema } = require("./schema");
const Food = require("./models/food");
const ExpressError = require("./utils/ExpressError.js");

const validateFood = (req, res, next) => {
  //   let { title, description, image, price, category } = req.body;
  let { error } = foodValidationSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateId = (req, res, next) => {
  let { error } = idSchema.validate(req.params);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports = { validateFood, validateId };
