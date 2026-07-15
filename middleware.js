const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Parses flat multipart keys like listing[title] into nested objects
module.exports.parseNestedBody = (req, res, next) => {
    if (req.body) {
        const nested = {};
        for (const key in req.body) {
            const match = key.match(/^(\w+)\[(\w+)\](?:\[(\w+)\])?$/);
            if (match) {
                const [_, parent, child, subchild] = match;
                if (!nested[parent]) nested[parent] = {};
                if (subchild) {
                    if (!nested[parent][child]) nested[parent][child] = {};
                    nested[parent][child][subchild] = req.body[key];
                } else {
                    nested[parent][child] = req.body[key];
                }
            } else {
                nested[key] = req.body[key];
            }
        }
        // Merge nested fields into req.body
        Object.assign(req.body, nested);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const errorDetails = error.details.map((ele) => ele.message).join(", ");
        console.error("Listing validation error:", errorDetails);
        throw new ExpressError(400, errorDetails);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        console.error("Review validation error:", errmsg);
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Only redirect directly to the requested URL if it was a GET request.
        // For POST/PUT/DELETE/AJAX operations, redirect the user back to the referring page instead.
        if (req.method === "GET") {
            req.session.returnTo = req.originalUrl;
        } else {
            req.session.returnTo = req.get("Referrer") || "/listings";
        }
        req.flash("error", "Please Login to Proceed!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the Owner of this Listing!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review does not exist!");
            return res.redirect(`/listings/${id}`);
        }
        if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.saveRedirect = req.session.returnTo;
    }
    next();
};