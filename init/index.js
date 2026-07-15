const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const path = require("path");

// Load environment variables from .env in the parent directory
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.ATLAS_DBURL;

if (!dbUrl) {
    console.error("Error: ATLAS_DBURL is not defined in the environment variables.");
    process.exit(1);
}

async function initializeDB() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(dbUrl);
        console.log("Connected to database successfully!");

        // Safely clear database collections
        console.log("Cleaning up old collections...");
        await Listing.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
        console.log("Database cleared.");

        // Register default owner user (admin/admin123)
        console.log("Registering default admin owner user...");
        const adminUser = new User({
            email: "admin@wonderland.com",
            username: "admin"
        });
        const registeredAdmin = await User.register(adminUser, "admin123");
        console.log("Default admin owner registered. ID:", registeredAdmin._id);

        // Assign the registered owner's ID to every listing
        const finalData = initdata.data.map((obj) => ({
            ...obj,
            owner: registeredAdmin._id
        }));

        // Seed listings
        console.log("Seeding sample listings into MongoDB Atlas...");
        await Listing.insertMany(finalData);
        console.log("Sample listings inserted successfully!");

    } catch (error) {
        console.error("Error during database seeding:", error);
    } finally {
        // Disconnect mongoose
        mongoose.connection.close();
        console.log("Mongoose connection closed.");
    }
}

initializeDB();
