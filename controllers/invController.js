const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    message: "",
  })
}

/* ******************************
* Deliver inventory by details view
* ******************************/
invCont.buildByInventoryId = async function (req, res, next) {
  // console.log(this.buildByInventoryId)
  const inv_id = req.params.inventoryId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  // console.log("VEHICLE DATA =>", data)
  const invDesc = await utilities.buildInventoryDetails(data);
  if (data.length > 0) {
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const make = data[0].inv_make;
    const model = data[0].inv_model;
    const year = data[0].inv_year;
    res.render("./inventory/details", {
      title: `${make} ${model} - ${year}`,
      invDesc,
      grid,
      nav,
      message:""
    });
  } else {
    const error = new Error("Sorry, car not found")
    error.status = 404;
    next(error);
  }
}

/* ******************************
* Management view
* ******************************/
invCont.buildManagementPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null
  })
}

/* ******************************
* Add classification view
* ******************************/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ******************************
* Add classification processing
* ******************************/
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(
    classification_name
  ) 
  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `The ${classification_name} classification was added.`
    )
    res.status(201).redirect("/inv/management")
  } else {
    req.flash(
      "notice",
      "Error adding classification, please try again."
    )
    res.status(501).redirect("/inv/add-classification")
  }
}

/* ******************************
* Intentionally trigger a 500 error
* ******************************/
invCont.triggerError = function (req, res, next) {
  const error = new Error("Intentional Server Crash!")
  error.status = 500
  next(error)
}

module.exports = invCont