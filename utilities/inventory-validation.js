const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/*  **********************************
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

module.exports = validate