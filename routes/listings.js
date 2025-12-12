const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const Listing = require("../models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("../utility/asyncWrap.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
/*
// testing api
router.get("/listingTest", (req, res) => {
    let testList = new Listing({
        title: "My testing Villa",
        description: "12 BHK with swimming pool",
        price: 12000,
        location: "Jalandhar",
        country: "India"
    });
    testList.save().then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log("Error in inserting testing villa to database : " + err);
    });
    // sample data insterted successfuly so res.send function is used at last to display the message
    res.send("Sucess!!  : Testing Sample Data inserted into database ");
});
*/

// index api
router.get("/", asyncWrap(listingsController.index));

// new listing
router.get("/new", isLoggedIn , listingsController.renderNewForm);

// post listing
router.post("/", isLoggedIn, validateListing, asyncWrap(listingsController.createListing));

// Read or Show Api
router.get("/:id", asyncWrap(listingsController.showListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingsController.renderEditForm));

router.put("/:id", isLoggedIn, isOwner, validateListing, asyncWrap(listingsController.updateListing));

router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingsController.destroyListing));

module.exports = router;