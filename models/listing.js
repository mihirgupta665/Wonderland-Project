const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        type : String,
        default: "https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?cs=srgb&dl=pexels-ahmetcotur-31817157.jpg&fm=jpg",
        set: (v) => v === "" ?"https://images.pexels.com/photos/31817157/pexels-photo-31817157.jpeg?cs=srgb&dl=pexels-ahmetcotur-31817157.jpg&fm=jpg"
                             : v,
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    }
});

const Listing = mongoose.model("Listing", listingSchema)        // creating the model or collection with corresponding created Schema
module.exports = Listing;       // exporting the created model or collection.
