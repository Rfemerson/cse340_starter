const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewCont = {}

/* ***************************
 * Add a new review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { review_text, inv_id, account_id } = req.body
  
  const addResult = await reviewModel.addReview(
    review_text,
    inv_id,
    account_id
  )

  if (addResult) {
    req.flash("notice", "Thank you for your review!")
  } else {
    req.flash("notice", "Sorry, there was an error submitting your review. Please try again.")
  }
  res.status(201).redirect(`/inv/detail/${inv_id}`)
}

module.exports = reviewCont