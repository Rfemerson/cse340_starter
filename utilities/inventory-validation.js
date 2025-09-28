const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/* *********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Classification name must be between 2 and 100 characters.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only letters.")
      .custom(async (value) => {
        const classification = await inventoryModel.getClassificationByName(value);
        if (classification) {
          return Promise.reject("Classification name already exists.");
        }
      }),
  ];
};

/* ******************************
* Check data and return errors or continue to add classification
* ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ******************************
* Add inventory Data Validation Rules
* ***************************** */
validate.inventoryRules = () => [
  body("inv_make")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Make must be at least two characters long."),
  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be at least three characters long."),
  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),
  body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image must be a valid partial URL."),
  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail must be a valid partial URL."),
  body("inv_price")
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive decimal."),
  body("inv_year")
    .trim()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Year must be between 1900 and 2100."),
  body("inv_miles")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Miles must be a positive integer."),
  body("inv_color")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Color must be at least two characters long."),
];

/* ******************************
* Check data and return errors or continue to add inventory
* ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
  let selectList = await utilities.selectList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      selectList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate