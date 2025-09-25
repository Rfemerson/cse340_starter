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
* Intentionally trigger a 500 error
* ******************************/
invCont.triggerError = function (req, res, next) {
  // Cria um erro 500
  const error = new Error("Intentional Server Crash!")
  error.status = 500
  next(error)
}

module.exports = invCont