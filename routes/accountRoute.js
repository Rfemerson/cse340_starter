const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController"); 
const regValidate = require("../utilities/account-validation");

// Route to build account login by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process account registration
router.post(
  '/register', 
  regValidate.registrationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build the account management view
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build the account update view
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdateView));

// Route to process account information update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process password update
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to process logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
