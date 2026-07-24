const fs = require("fs");
const path = require("path");

// Handle favicon migration and cleanup
try {
    const rootFaviconPng = path.join(__dirname, "favicon.png");
    const publicFaviconPng = path.join(__dirname, "public", "favicon.png");
    const rootFaviconIco = path.join(__dirname, "favicon.ico");

    // If the new favicon is in the root, move it to the public directory
    if (fs.existsSync(rootFaviconPng)) {
        const publicDir = path.join(__dirname, "public");
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.copyFileSync(rootFaviconPng, publicFaviconPng);
        fs.unlinkSync(rootFaviconPng);
        console.log("Moved favicon.png from root to public/");
    }

    // Delete the old favicon.ico from root if it exists
    if (fs.existsSync(rootFaviconIco)) {
        fs.unlinkSync(rootFaviconIco);
        console.log("Deleted old favicon.ico from root");
    }
} catch (err) {
    console.error("Error managing favicon files:", err.message);
}

if(process.env.NODE_ENV != "production"){       // when NODE.ENV is not production only then we will use dotenv else we will hide it.. 
    require('dotenv').config();     // dotenv is used to use env variable in backend 
}
// console.log(process.env);  // we coould access the .env file 
// npm i cloudinary and npm i multi-storage-cloudinary is used tp connect with cloudinary and using multer to upload certain files to cloudinary


const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("./utility/asyncWrap.js");
const ExpressError = require("./utility/ExpressError.js");
const Listings = require("./routes/listings.js");
const Reviews = require("./routes/reviews.js");
const Users = require("./routes/user.js");
const session = require("express-session");
// connect-mongo : is used as session storage
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
// passport is needed for authetication
// const LocalStrategy = require("passport-local");        /// it is a class we need local authentication strategy so passport-local is needed
// required the mongoos model of user with has the lpugin of passport-local-mongoose
const passport = require("passport");
const User = require("./models/user.js");
// npm i multer is a node.js middleware used to parse multipart/form-data i.e. forms having files uploaded.
// npm install @mapbox/mapbox-sdk  : need to be installed its a good mapbox-sdk
const compression = require("compression");
const morgan = require("morgan");
const { parseNestedBody } = require("./middleware.js");

const app = express();
app.set("trust proxy", 1); // Trust Render's reverse proxy for secure cookies

const dbUrl = process.env.ATLAS_DBURL;

async function connectDBWithRetry(maxRetries = 5, delayMs = 2000) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            await mongoose.connect(dbUrl);
            console.log("MongoDB connected successfully!");
            console.log("Connected DB:", mongoose.connection.name);
            console.log("Host:", mongoose.connection.host);
            return;
        } catch (err) {
            attempts++;
            console.error(`MongoDB connection attempt ${attempts}/${maxRetries} failed:`, err.message);
            if (attempts >= maxRetries) {
                console.error("All MongoDB connection attempts failed. Exiting process...");
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}

connectDBWithRetry();

if (!process.env.VERCEL) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Listening through port : ${port}`);
    });
}

app.use(compression());
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon.png"));
});
app.use(express.urlencoded({ extended: true }));
app.use(parseNestedBody); // Parse multipart/urlencoded form bodies to nested structures
app.use(methodOverride("_method"));

const store = (MongoStore.default || MongoStore).create({           // MongoStore directly stores the sessions in a collection named sessions
    mongoUrl: dbUrl, // first mongodb database url need to be mentioned, at this the session info will be stroed
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 86400,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store : " + err);
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
}));    // creating session for porject

app.use(flash());

// passport need to be initialized.
// passport must be active for the entire session
// web application needs an ability to identify users as they browse from one page to another. 
// This series of request and response each associated with te same user is knwo as session.
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: `Incorrect username!` });
        }
        
        const authResult = await user.authenticate(password);
        if (authResult.error || !authResult.user) {
            return done(null, false, { message: "Incorrect password!" });
        }
        return done(null, authResult.user);
    } catch (err) {
        return done(err);
    }
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;     // as we have done authentication so req.user will always be with us for each session session
    res.locals.mapToken = process.env.MAP_TOKEN; // Safely pass Mapbox token to templates
    res.locals.backendUrl = process.env.BACKEND_URL || '';
    next();
});

// app.listen(8080, () => {
//     console.log("Listening through port  : " + 8080);
// })




// function is wrapping the joy object so that it could be usd as a middleware function



app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "mihirgupta665@gmail.com",
        username: "Mihir Gupta"        // usernaem salted and hashed filed was already creatinf by deault by the passpor-local-mongoose
    });

    let registeredUser = await User.register(fakeUser, "mihir123");
    res.send(registeredUser);
});

// app.use((req, res, next) => {
//     console.log("INCOMING:", req.method, req.url);
//     next();
// });

app.get("/", (req, res)=>{
    res.redirect("/listings");
})
app.get("/ping", (req, res) => {
    res.json({ status: "ok" });
});
//Routers
app.use("/", Users);
// listign route
app.use("/listings", Listings);
// post review route
app.use("/listings/:id/reviews", Reviews);
// user route

app.use((req, res, next) => {
    console.error("Error URL    :", req.originalUrl);
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    console.log(err);
    let { status = 500, message = "Somthing Went Wrong!" } = err;
    res.status(status).render("error", { err });
    console.log(err.name);

});

// app.use((err, req, res, next) => {
//     console.error("ERROR HANDLER CAUGHT:", err);  // full error + stack
//     const { status = 500, message = "Something went wrong!" } = err;
//     res.status(status).send(`<h1>${status}</h1><p>${message}</p>`);
// });


// Form Validation : When we enter the data iun the form the browser must check whether the data is properly formated and obeys all the constraint set by the application.

// npm i joi is used to validate are schema  (ejex is also used to test api)

// to validate server side we need 3 things : i> Joi Schema, ii> create function to validate , iii> pass it as a middleware in post request

// cookies : HTTP cookies are small block of data created be a web server while a user is browsing a website and placed on user's coumputer or other device by user's web browser.
// npm i cookie-parser, parse name cookie and print hi and name should have anonymous as the default value
// signedCookie

// during deployment engine need to be specified with node version so that playform of deployment could understand which version of node to use

module.exports = app;