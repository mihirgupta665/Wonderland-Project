const express = require("express");
const router = express.Router({mergeParams : true});    // preserves the paramters of parent route for the child route
const asyncWrap = require("../utility/asyncWrap.js");
const ExpressError = require("../utility/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // as review is being added in listing model therefore we need lsiting model too.

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

router.post("/", validateReview, asyncWrap(async (req, res) => {
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
router.delete("/:reviewId", asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;