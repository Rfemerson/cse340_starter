// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// vehicle details route
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Route to build management view
router.get("/management", invController.buildManagementPage);

module.exports = router;