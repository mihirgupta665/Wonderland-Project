const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    // as veiw has been set therefore express will find vies directory and specified file will be rendered as ejs by default.
    res.render("listings/index.ejs", { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {
    let { listing } = req.body;
    let newlisting = await new Listing(listing);
    newlisting.owner = req.user._id; 
    await newlisting.save();

    // creating a flash message  for each successfull addition of listing
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {                 // nested populate is done by populate : and object of path : property
                path: "author",
            },
        })
        .populate("owner");   // populate the details of the array neamed reviews
    if (!listing) {
        req.flash("error", "Listing does not exists");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    if (!listing) {
        req.flash("error", "Listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    //with destructing of object its properties becomes direct keys and value
    // console.log(req.body.listing)
    await Listing.findByIdAndUpdate(id, req.body.listing)   //deconstructing the listing object using ...req.body.listing
    req.flash("success", "Updated Listing Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}