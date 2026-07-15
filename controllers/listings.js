const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');      
let mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Geocode forward query with up to 5 retries on connection error/timeout
async function geocodeWithRetry(location, maxRetries = 5) {
    let response = null;
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            response = await geocodingClient.forwardGeocode({
                query: location,
                limit: 1
            }).send();
            return { success: true, response };
        } catch (err) {
            attempts++;
            console.error(`Mapbox geocoding attempt ${attempts}/${maxRetries} failed:`, err.message);
            if (attempts >= maxRetries) {
                return { success: false, error: err };
            }
            // Wait 200ms before retrying
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
}

module.exports.index = async (req, res) => {
    let query = {};
    const { category, location, country, minPrice, maxPrice, amenities, sort } = req.query;

    if (category) {
        query.category = category;
    }
    if (location) {
        query.$or = [
            { title: { $regex: location, $options: "i" } },
            { location: { $regex: location, $options: "i" } }
        ];
    }
    if (country) {
        query.country = { $regex: country, $options: "i" };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (amenities) {
        const amenArr = Array.isArray(amenities) ? amenities : [amenities];
        query.amenities = { $all: amenArr };
    }

    let sortOption = {};
    if (sort === "newest") {
        sortOption = { _id: -1 };
    } else if (sort === "oldest") {
        sortOption = { _id: 1 };
    } else if (sort === "priceHigh") {
        sortOption = { price: -1 };
    } else if (sort === "priceLow") {
        sortOption = { price: 1 };
    }

    let listings = await Listing.find(query).sort(sortOption).populate("reviews");

    if (sort === "highestRated") {
        listings.sort((a, b) => {
            const avgA = a.reviews.length ? (a.reviews.reduce((sum, r) => sum + r.ratings, 0) / a.reviews.length) : 0;
            const avgB = b.reviews.length ? (b.reviews.reduce((sum, r) => sum + r.ratings, 0) / b.reviews.length) : 0;
            return avgB - avgA;
        });
    }

    res.render("listings/index.ejs", { listings, filters: req.query });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let response = { body: { features: [] } };
    let geocodingSuccess = false;
    
    let geocodeResult = await geocodeWithRetry(req.body.listing.location, 5);
    if (geocodeResult.success) {
        response = geocodeResult.response;
        geocodingSuccess = true;
    }

    if (geocodingSuccess && (!response.body.features || response.body.features.length === 0)) {
        req.flash("error", `Could not find a valid location for '${req.body.listing.location}'. Please enter a valid city or address.`);
        return res.redirect("/listings/new");
    }

    let url = req.file ? req.file.path : "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?cs=srgb&dl=pexels-ahmetcotur-31817157.jpg&fm=jpg";
    let filename = req.file ? req.file.filename : "listingimage";

    let { listing } = req.body;
    let newlisting = new Listing(listing);
    newlisting.owner = req.user._id; 
    newlisting.image = { filename, url };

    if (geocodingSuccess && response.body && response.body.features && response.body.features.length > 0) {
        newlisting.geometry = response.body.features[0].geometry;
    } else {
        newlisting.geometry = {
            type: "Point",
            coordinates: [77.209, 28.613] // default fallback New Delhi
        };
    }

    await newlisting.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    // Compute rating statistics
    let avgRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (listing.reviews.length > 0) {
        let sum = 0;
        listing.reviews.forEach(r => {
            sum += r.ratings;
            if (ratingDistribution[r.ratings] !== undefined) {
                ratingDistribution[r.ratings]++;
            }
        });
        avgRating = Number((sum / listing.reviews.length).toFixed(1));
    }

    res.render("listings/show.ejs", { listing, avgRating, ratingDistribution });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250/e_blur:200");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    if (req.body.listing && !req.body.listing.amenities) {
        req.body.listing.amenities = [];
    }

    let response = { body: { features: [] } };
    let geocodingSuccess = false;
    
    let geocodeResult = await geocodeWithRetry(req.body.listing.location, 5);
    if (geocodeResult.success) {
        response = geocodeResult.response;
        geocodingSuccess = true;
    }

    if (geocodingSuccess && (!response.body.features || response.body.features.length === 0)) {
        req.flash("error", `Could not find a valid location for '${req.body.listing.location}'. Please enter a valid city or address.`);
        return res.redirect(`/listings/${id}/edit`);
    }

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    // Update geometry if geocoding query returned features
    if (geocodingSuccess && response.body && response.body.features && response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    } else if (!geocodingSuccess) {
        // Keep old geometry if API connection failed, or default if missing
        if (!listing.geometry) {
            listing.geometry = {
                type: "Point",
                coordinates: [77.209, 28.613]
            };
        }
    }

    // Update text fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;
    listing.category = req.body.listing.category;
    listing.availability = req.body.listing.availability;
    listing.amenities = req.body.listing.amenities;

    if (req.file) {
        // Delete old image from Cloudinary if it's not the default placeholder
        if (listing.image && listing.image.filename && listing.image.filename !== "listingimage") {
            try {
                const { cloudinary } = require("../cloudConfig.js");
                await cloudinary.uploader.destroy(listing.image.filename);
                console.log("Deleted old image from Cloudinary on update:", listing.image.filename);
            } catch (err) {
                console.error("Failed to delete image from Cloudinary on update:", err);
            }
        }
        
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
    }
    
    await listing.save();
    req.flash("success", "Updated Listing Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    
    // Delete image from Cloudinary if it's not the default placeholder
    if (deletedListing && deletedListing.image && deletedListing.image.filename && deletedListing.image.filename !== "listingimage") {
        try {
            const { cloudinary } = require("../cloudConfig.js");
            await cloudinary.uploader.destroy(deletedListing.image.filename);
            console.log("Deleted image from Cloudinary on listing deletion:", deletedListing.image.filename);
        } catch (err) {
            console.error("Failed to delete image from Cloudinary on listing deletion:", err);
        }
    }
    
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};

module.exports.renderFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "favorites",
        populate: {
            path: "reviews"
        }
    });
    res.render("listings/favorites.ejs", { listings: user.favorites });
};

module.exports.toggleFavorite = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.user._id);
    let listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const index = user.favorites.findIndex(favId => favId.toString() === id);
    let isFavorite = false;
    if (index === -1) {
        user.favorites.push(id);
        isFavorite = true;
    } else {
        user.favorites.splice(index, 1);
        isFavorite = false;
    }
    await user.save();
    res.json({ success: true, isFavorite, title: listing.title });
};