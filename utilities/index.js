const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="/' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
* Build details view
* ***************************/
Util.buildInventoryDetails = async function(data){
  let invDesc = ""
  if(data.length > 0){
      invDesc += '<div class="detailpage">'
      data.forEach(vehicle => {
        invDesc += '<div class="detail-content">'
        invDesc += '<img id="detailimg" src="' + vehicle.inv_image + '" alt="Image of '+ vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
        invDesc += '<section id="invDetails">'
        invDesc += '<h3 class="detailPrice"><span class="label">Price: </span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h3>'
        invDesc += vehicle.inv_description
        invDesc += '<h3 class="detailInfo"><span class="label">Color:</span> ' + vehicle.inv_color + '</h3>'
        invDesc += '<h3 class="detailInfo"><span class="label">Miles:</span> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</h3>'
        invDesc += '</section>'
        invDesc += '</div>'
          
      })
      invDesc += '</div>'
      
  } else {
      invDesc += '<p class="notice">Sorry, no matching description could be found.</p>'
  }
  return invDesc
}

/* ***************************
* Build the classification select list
* ***************************/
Util.selectList = async function (classification_id) {
    let data = await invModel.getClassifications()
    let list = '<select class="lbl-properties classification_id" id="classificationList" name="classification_id" required>'
    list += '<option value="" selected>Choose a classification</option>'
    data.rows.forEach((row) => {
        list += `<option value="${row.classification_id}"`
        if (classification_id) {
            if(row.classification_id == classification_id) {
                list += ' selected '
            }
        }
        list += `>${row.classification_name}</option>`
    })
    list += '</select>'
    return list
}

/* **************************************
* Build the reviews view HTML
* ************************************ */
Util.buildReviews = async function(reviews) {
  let html = '<ul class="review-list">'
  if (reviews.length > 0) {
    reviews.forEach(review => {
      const reviewDate = new Date(review.review_date).toLocaleString()
      html += '<li>'
      html += `<p class="review-text">"${review.review_text}"</p>`
      html += `<p class="review-author">By: ${review.account_firstname} on ${reviewDate}</p>`
      html += '</li>'
    })
  } else {
    html += '<li>Be the first to write a review!</li>'
  }
  html += '</ul>'
  return html
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice", "Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 * Middleware to Check Login Status
 **************************************** */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* *********************************
* Check account type
* *******************************/
Util.checkAuthorization = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type
    if (accountType === "Admin" || accountType === "Employee") {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this page.")
      res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "You must be logged in to access this page.")
    res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util