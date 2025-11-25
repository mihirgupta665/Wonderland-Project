const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "view")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.listen(8080, ()=>{
    console.log("Listening through port  : "+8080);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}

main().then((res)=>{
    console.log("Connection Established");
}).catch((err)=>{
    console.log("Error in connecting mongodb database : "+err);
});

app.get("/", (req,res)=>{
    res.send("Server is Working Fine!!!");
})

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
