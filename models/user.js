const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
    email : {
        type : string,
        required : true
    }
})

User.plugin(passportLocalMongoose); // this plugin adds the passport-local-mongoose methods and static method to this model or collection

module.exports = mongoose.model("User", userSchema);