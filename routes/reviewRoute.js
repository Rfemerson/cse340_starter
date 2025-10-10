const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require("../utilities/review-validation")

// Route to add a new review
router.post(
  "/add",
  utilities.checkLogin, // Garante que apenas usuários logados possam postar
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

module.exports = router
