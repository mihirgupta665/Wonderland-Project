const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("./utility/asyncWrap.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const Listings = require("./routes/listings.js");
// npm i joi is used to validate are schema

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(8080, () => {
    console.log("Listening through port  : " + 8080);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}

main().then((res) => {
    console.log("Connection Established");
}).catch((err) => {
    console.log("Error in connecting mongodb database : " + err);
});

// function is wrapping the joy object so that it could be usd as a middleware function
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

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);   // the joi schema created validates the req.body
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else {
        next();
    }
}

// home api
app.get("/", (req, res) => {
    res.send("Server is Working Fine!!!");
})

app.use("/listings", Listings);

// post review route
app.post("/listings/:id/reviews", validateReview, asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("Review Submitted Successfully");
    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
// $pull : this operator is used to remove from an exisitng array all the instances of value or values that matches a specified condition.
app.delete("/listings/:id/reviews/:reviewId", asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Somthing Went Wrong!" } = err;
    res.status(status).render("error", { err });
    console.log(err.name);

});

// Form Validation : When we enter the data iun the form the browser must check whether the data is properly formated and obeys all the constraint set by the application.

// npm i joi is used to validate are schema  (ejex is also used to test api)

// to validate server side we need 3 things : i> Joi Schema, ii> create function to validate , iii> pass it as a middleware in post request
