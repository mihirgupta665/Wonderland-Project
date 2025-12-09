const { string } = require("joi");
const mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");
// console.log("passportLocalMongoose ->", typeof passportLocalMongoose, passportLocalMongoose);
// console.log(typeof passportLocalMongoose.default);
if(typeof passportLocalMongoose == "object"){       // sometimes it gievs object but we need function as plugin expects function
    passportLocalMongoose=passportLocalMongoose.default;
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
    // passport-local-mongoose : by default add a salted and hashed username and password fields
    // pbkdf2 : is the hashing algorithm implemented in passport-local-mongoose
});

//plugin expects function so ensure the required passport-local-mongoose gives a function not a object
userSchema.plugin(passportLocalMongoose); // this plugin adds the passport-local-mongoose methods and static method to its model or collection

/* Static Methods given to user model are 
authenticate() : Generates a function that is used in Passport's LocalStrategy
serializeUser() : Generates a function that is used by Passport to serialize users into the session
deserializeUser() : Generates a function that is used by Passport to deserialize users into the session
register(user, password, cb)  : Convenience method to register a new user instance with a given password. Checks if username is unique.
findByUsername() : Convenience method to find a user instance by it's unique username.
createStrategy() : Creates a configured passport-local LocalStrategy instance that can be used in passport.
*/

module.exports = mongoose.model("User", userSchema);