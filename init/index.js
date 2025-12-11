const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}
main();

async function initializeDB(){
    console.log("Initializing MongoDB...");
    await Listing.deleteMany({});
    // to add miscellaneous property in object use map function   ...obj to desrtucture object then commaa sapareted properties to add on more propertities.
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "693996aadc081af45a556770" }) );
    await Listing.insertMany(initdata.data);
    console.log("Initialized MongoDB database");
}
initializeDB();


