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
const Reviews = require("./routes/reviews.js");
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

// home api
app.get("/", (req, res) => {
    res.send("Server is Working Fine!!!");
})

// listign route
app.use("/listings", Listings);

// post review route
app.use("/listings/:id/reviews", Reviews);

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
