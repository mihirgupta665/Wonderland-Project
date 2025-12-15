const mongoose = require("mongoose");
const Review = require("./review.js");
const { required, number } = require("joi");
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    // coordinate : {       // this is not geoJSON we will write all in geoJSON format
    //     type : [number],
    //     required: true,
    // }
    geometry : {
        type: {
            type: String,
            enum: ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }
});

// mongoose middleware for delete query (post {thenafter} )
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema)        // creating the model or collection with corresponding created Schema
module.exports = Listing;       // exporting the created model or collection.
