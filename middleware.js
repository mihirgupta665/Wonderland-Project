const Listing = require("./models/listing.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);   // the joi schema created validates the req.body
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("user : ", req.user);
                // rel path        // full path after localhost
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        // console.log("Original Url : ",req.originalUrl);
        req.session.returnTo = req.originalUrl;         // saving the originalUrl in the session
        // console.log(req.session);
        req.flash("error", "Please Login to Proceed!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log("CurrUser : ",res.locals.currUser);
    if(!res.locals.currUser || !res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error", "You are not the Owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}