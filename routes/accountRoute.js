const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController"); 
const regValidade = require("../utilities/account-validation")

// Route to build account login by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to process account registration
router.post('/register', 
    regValidade.registrationRules(), 
    regValidade.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)


module.exports = router;
