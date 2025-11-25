const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
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
    price :  Number,
    location : String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema)        // creating the model or collection with corresponding created Schema
module.exports = Listing;       // exporting the created model or collection.
