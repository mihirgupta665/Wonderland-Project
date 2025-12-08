const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const Listing = require("../models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("../utility/asyncWrap.js");
const ExpressError = require("../utility/ExpressError.js");
const { listingSchema } = require("../schema.js");



const validateListing = (req, res, next) => {
    // .validate() : the joi object is need to validate the req.body().
    let { error } = listingSchema.validate(req.body);       // returns a result which may ahev the filed of error (if error exists) 
    if (error) {
        // console.log(error);
        // error contains a property named details which is a  object of message, path, type and context
        // we could map each element of the detail array and join them using the map function and join function
        const errorDetails = error.details.map((ele) => ele.message).join(", ");
        console.log(errorDetails);
        throw new ExpressError(400, errorDetails);
    }
    else {
        next();
    }
}

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

// index api
router.get("/", asyncWrap(async (req, res) => {
    let listings = await Listing.find({});
    // as veiw has been set therefore express will find vies directory and specified file will be rendered as ejs by default.
    res.render("listings/index.ejs", { listings });
}));

// new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});
// post listing
router.post("/", validateListing, asyncWrap(async (req, res, next) => {
    let { listing } = req.body;
    let newlisting = await new Listing(listing);
    await newlisting.save();
    
    // creating a flash message  for each successfull addition of listing
    req.flash("success", "New Listing Created Successfully!");    
    res.redirect("/listings");
}));

// Read or Show Api
router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");   // populate the details of the array neamed reviews
    if(!listing){
        req.flash("error", "Listing does not exists");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

// edit route
router.get("/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    if(!listing){
        req.flash("error", "Listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    //with destructing of object its properties becomes direct keys and value
    // console.log(req.body.listing)
    await Listing.findByIdAndUpdate(id, req.body.listing)   //deconstructing the listing object using ...req.body.listing
    req.flash("success", "Updated Listing Successfully!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}));

module.exports = router;