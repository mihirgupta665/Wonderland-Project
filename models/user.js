const mongoose = require("mongoose");

// get the module (object with .default)
const plm = require("passport-local-mongoose");

// DEBUG (optional)
// console.log("plm ->", plm);
// console.log("typeof plm:", typeof plm);           // "object"
// console.log("typeof plm.default:", typeof plm.default); // "function"

// use the actual plugin function
const passportLocalMongoose = plm.default;   // 👈 THIS is the key

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // username, hash, salt will be added by passport-local-mongoose
});

// plugin expects a FUNCTION, so pass the function, not the object
// console.log(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
