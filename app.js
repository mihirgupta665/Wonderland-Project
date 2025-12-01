const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template
const asyncWrap = require("./utility/asyncWrap.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema } = require("./schema.js");
// nom i joi is used to validate are schema

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
const validateListing = (req, res, next) => {
    // .validate() : the joi object is need to validate the req.body().
    let { error } = listingSchema.validate(req.body);       // returns a result which may ahev the filed of error (if error exists) 
    if(error){
        // console.log(error);
        // error contains a property named details which is a  object of message, path, type and context
        // we could map each element of the detail array and join them using the map function and join function
        const errorDetails = error.details.map((ele) => ele.message).join(", "); 
        console.log(errorDetails);
        throw new ExpressError(400, errorDetails);     
    }
    else{
        next();
    }
}

// home api
app.get("/", (req, res) => {
    res.send("Server is Working Fine!!!");
})

// testing api
app.get("/listingTest", (req, res) => {
    let testList = new Listing({
        title: "My testing Villa",
        description: "12 BHK with swimming pool",
        price: 12000,
        location: "Jalandhar",
        country: "India"
    });
    testList.save().then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log("Error in inserting testing villa to database : " + err);
    });
    // sample data insterted successfuly so res.send function is used at last to display the message
    res.send("Sucess!!  : Testing Sample Data inserted into database ");
});

// index api
app.get("/listings", asyncWrap(async (req, res) => {
    let listings = await Listing.find({});
    // as veiw has been set therefore express will find vies directory and specified file will be rendered as ejs by default.
    res.render("listings/index.ejs", { listings });
}));

// new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
// post listing
app.post("/listings", validateListing, asyncWrap(async (req, res, next) => {
    let { listing } = req.body;
    let newlisting = await new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
}));

// Read or Show Api
app.get("/listings/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    //with destructing of object its properties becomes direct keys and value
    // console.log(req.body.listing)
    await Listing.findByIdAndUpdate(id, req.body.listing)   //deconstructing the listing object using ...req.body.listing
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));

app.use((req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Somthing Went Wrong!" } = err;
    res.status(status).render("error", {err} );
    console.log(err.name);

});

// Form Validation : When we enter the data iun the form the browser must check whether the data is properly formated and obeys all the constraint set by the application.

// nom i joi is used to validate are schema