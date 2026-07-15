const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const Listing = require("../models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("../utility/asyncWrap.js");
// npm i multer is a node.js middleware used to parse multipart/form-data i.e. forms having files uploaded.
const multer = require("multer");       // now file data could be parsed and a file parameter is added to req i.e req.file
// creating storage at cloudinary web service
const { storage } = require("../cloudConfig.js");
// in the storage of cloudinary we need to store now are files 
let upload = multer({ storage });     // multer takes a object with destination to save the files and gives another upload object
// upload.single('field_name') or upload.array could be used to uplad the file of the specified field of the form

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

router.route("/")
    .get(asyncWrap(listingsController.index)) // index api
    .post(isLoggedIn,
        upload.single("listing[image][url]"), 
        validateListing, 
        asyncWrap(listingsController.createListing)); // post listing

// new listing
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// Favorites list view (placed before /:id)
router.get("/favorites", isLoggedIn, asyncWrap(listingsController.renderFavorites));

// Toggle favorite endpoint
router.post("/:id/favorite", isLoggedIn, asyncWrap(listingsController.toggleFavorite));

router.route("/:id")
    .get(asyncWrap(listingsController.showListing)) // Read or Show Api
    .put(isLoggedIn, isOwner,
        upload.single("listing[image][url]"),
        validateListing,
        asyncWrap(listingsController.updateListing))     // update listing
    .delete(isLoggedIn, isOwner, asyncWrap(listingsController.destroyListing));    // delete listing

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingsController.renderEditForm));

module.exports = router;