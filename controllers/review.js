const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Written Successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    let listing = await Listing.findById(id);
    if (!review || !listing) {
        req.flash("error", "Review or Listing not found!");
        return res.redirect(`/listings/${id}`);
    }
    res.render("reviews/edit.ejs", { listing, review });
};

module.exports.updateReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, req.body.review);
    req.flash("success", "Review Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
};