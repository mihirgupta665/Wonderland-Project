const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?cs=srgb&dl=pexels-ahmetcotur-31817157.jpg&fm=jpg",
            set: (v) =>
                v === ""
                    ? "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?cs=srgb&dl=pexels-ahmetcotur-31817157.jpg&fm=jpg"
                    : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms', 'Arctic'],
        default: 'Trending'
    },
    availability: {
        type: String,
        enum: ['Available', 'Booked', 'Rented', 'Unavailable'],
        default: 'Available'
    },
    amenities: {
        type: [String],
        default: []
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// mongoose middleware for delete query
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
