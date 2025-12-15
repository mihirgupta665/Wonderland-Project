const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');      
let mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/* 
    requireing the mapbox sdk services geocoding
    then we need a maptoken og mapnox
    then through the documentation using the Geocoding
    then in our js funtion the object is used according to documentation to 
*/

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    // as veiw has been set therefore express will find vies directory and specified file will be rendered as ejs by default.
    res.render("listings/index.ejs", { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,       // query takes te location fo geoencoding
        limit: 1            // limits take the object number for coordinates
    })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    let { listing } = req.body;
    let newlisting = await new Listing(listing);
    newlisting.owner = req.user._id; 
    newlisting.image = {filename, url};
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);

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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250/e_blur:200");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    //with destructing of object its properties becomes direct keys and value
    // console.log(req.body.listing)
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing)   //deconstructing the listing object using ...req.body.listing
    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename, url};
        await listing.save();
    }
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