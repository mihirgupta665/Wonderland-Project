const express = require("express");
const router = express.Router({ mergeParams: true });    // preserves the paramters of parent route for the child route
const asyncWrap = require("../utility/asyncWrap.js");
const ExpressError = require("../utility/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // as review is being added in listing model therefore we need lsiting model too.
// middleware is the collections of middleware we need just one middleware out of the collection
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");


router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.createReview));

// edit review route
router.get("/:reviewId/edit", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.renderEditForm));

// update review route
router.put("/:reviewId", isLoggedIn, isReviewAuthor, validateReview, asyncWrap(reviewController.updateReview));

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.deleteReview));

module.exports = router;