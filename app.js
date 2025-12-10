const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("./utility/asyncWrap.js");
const ExpressError = require("./utility/ExpressError.js");
const Listings = require("./routes/listings.js");
const Reviews = require("./routes/reviews.js");
const Users = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
// npm i joi is used to validate are schema
// const passport = require("passport");       // passport is needed for authetication
// // const LocalStrategy = require("passport-local");        /// it is a class we need local authentication strategy so passport-local is needed
// const User = require("./models/user.js");       // required the mongoos model of user with has the lpugin of passport-local-mongoose
const passport = require("passport");
// const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(
    {
        secret: "MySuperSecretCode",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    }
));    // creating session for porject

// passport need to be initialized.
// passport must be active for the entire session
// web application needs an ability to identify users as they browse from one page to another. 
// This series of request and response each associated with te same user is knwo as session.
// passport.use(new LocalStrategy(User.authenticate()));   // strategy object is created and the model authentication method is passed to authenticate that model.
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// ✅ Use LocalStrategy explicitly with User.authenticate()
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DEBUG: see what strategies exist
// console.log("passport.authenticate typeof:", typeof passport.authenticate);
// console.log("registered strategies:", passport._strategies);
// console.log("local strategy:", passport._strategy("local"));
// console.log("for user");
// console.log("typeof User.authenticate:", typeof User.authenticate);
// console.log("User.authenticate():", User.authenticate());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.listen(8080, () => {
    console.log("Listening through port  : " + 8080);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}

main().then((res) => {
    console.log("Connection Established");
}).catch((err) => {
    console.log("Error in connecting mongodb database : " + err);
});

// function is wrapping the joy object so that it could be usd as a middleware function

// home api
app.get("/", (req, res) => {
    res.send("Server is Working Fine!!!");
})

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "mihirgupta665@gmail.com",
        username: "Mihir Gupta"        // usernaem salted and hashed filed was already creatinf by deault by the passpor-local-mongoose
    });

    let registeredUser = await User.register(fakeUser, "mihir123");
    res.send(registeredUser);
});

app.use((req, res, next) => {
    console.log("INCOMING:", req.method, req.url);
    next();
});


//Routers
app.use("/", Users);
// listign route
app.use("/listings", Listings);
// post review route
app.use("/listings/:id/reviews", Reviews);
// user route

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// app.use((err, req, res, next) => {
//     console.log(err);
//     let { status = 500, message = "Somthing Went Wrong!" } = err;
//     res.status(status).render("error", { err });
//     console.log(err.name);

// });

app.use((err, req, res, next) => {
    console.error("ERROR HANDLER CAUGHT:", err);  // full error + stack
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).send(`<h1>${status}</h1><p>${message}</p>`);
});


// Form Validation : When we enter the data iun the form the browser must check whether the data is properly formated and obeys all the constraint set by the application.

// npm i joi is used to validate are schema  (ejex is also used to test api)

// to validate server side we need 3 things : i> Joi Schema, ii> create function to validate , iii> pass it as a middleware in post request

// cookies : HTTP cookies are small block of data created be a web server while a user is browsing a website and placed on user's coumputer or other device by user's web browser.
// npm i cookie-parser, parse name cookie and print hi and name should have anonymous as the default value
// signedCookie