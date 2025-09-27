// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// vehicle details route
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagementPage));

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);
router.post(
    "/add-classification", 
    classValidate.classificationRules(), 
    classValidate.checkAddClassificationData, 
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;