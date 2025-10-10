const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .notEmpty()
      .withMessage("Review content cannot be empty."),
  ]
}

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const inv_id = req.body.inv_id
    req.flash("notice", "Review cannot be empty. Please try again.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

module.exports = validate