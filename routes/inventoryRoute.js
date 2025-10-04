const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// vehicle details route
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
// Route to build management view
router.get("/", utilities.checkAuthorization, utilities.checkLogin, utilities.handleErrors(invController.buildManagementPage));

// Route to build add classification view
router.get("/add-classification", utilities.checkAuthorization, invController.buildAddClassification);
// Route to add classification
router.post(
    "/add-classification", 
    invValidate.classificationRules(), 
    invValidate.checkAddClassificationData, 
    utilities.checkAuthorization,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAuthorization, invController.buildAddInventory);
// Route to add inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkAddInventoryData,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.addInventory)
);

// Route to build get inventory view
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.editInventoryView));

// Route to update inventory
router.post(
    "/update",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.updateInventory)
);

// Route to build delete inventory view
router.get("/delete/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventoryView));

// Route to delete inventory
router.post(
    "/delete", 
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteItem)
);

module.exports = router;