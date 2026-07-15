const mongoose = require("mongoose");

// get the module (object with .default)
const plm = require("passport-local-mongoose");

// use the actual plugin function
const passportLocalMongoose = plm.default;   // 👈 THIS is the key

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
    // username, hash, salt will be added by passport-local-mongoose
});


// plugin expects a FUNCTION, so pass the function, not the object
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
