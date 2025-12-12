const express = require("express");
const router = express.Router({ mergeParams: true });    // preserves the paramters of parent route for the child route
const asyncWrap = require("../utility/asyncWrap.js");
const ExpressError = require("../utility/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // as review is being added in listing model therefore we need lsiting model too.
// middleware is the collections of middleware we need just one middleware out of the collection
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


router.post("/", isLoggedIn ,validateReview, asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("Review Submitted Successfully");
    req.flash("success", "Review Written Successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
// $pull : this operator is used to remove from an exisitng array all the instances of value or values that matches a specified condition.
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;