const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");    // ejs-mate is used to create a styled template

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.listen(8080, ()=>{
    console.log("Listening through port  : "+8080);
})

app.engine("ejs", ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}

main().then((res)=>{
    console.log("Connection Established");
}).catch((err)=>{
    console.log("Error in connecting mongodb database : "+err);
});

// home api
app.get("/", (req,res)=>{
    res.send("Server is Working Fine!!!");
})

// testing api
app.get("/listingTest", (req,res)=>{
    let testList = new Listing({
        title : "My testing Villa",
        description : "12 BHK with swimming pool",
        price : 12000,
        location : "Jalandhar",
        country: "India"
    });
    testList.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log("Error in inserting testing villa to database : "+err);
    });
    // sample data insterted successfuly so res.send function is used at last to display the message
    res.send("Sucess!!  : Testing Sample Data inserted into database ");   
});

// index api
app.get("/listings", async (req, res)=>{
    let listings = await Listing.find({});
    // as veiw has been set therefore express will find vies directory and specified file will be rendered as ejs by default.
    res.render("listings/index.ejs", {listings});    
})

// new listing
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});
// post listing
app.post("/listings", async (req,res)=>{
    let {listing} = req.body;
    let newlisting = await new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
});

// Read or Show Api
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let listing  = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
})

app.get("/listings/:id/edit", async (req, res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs", { listing });
})

app.put("/listings/:id", async (req,res)=>{
    let { id } = req.params;
    //with destructing of object its properties becomes direct keys and value
    console.log(req.body.listing)
    await Listing.findByIdAndUpdate(id, req.body.listing)   //deconstructing the listing object using ...req.body.listing
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// Form Validation : When we enter the data iun the form the browser must check whether the data is properly formated and obeys all the constraint set by the application.