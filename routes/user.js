const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");

const app = express();
const router = express.Router();


router.get("/signup", (req, res)=>{
    res.render("users/signup");
});

router.post("/signup", asyncWrap(async (req, res)=>{
    try{    // writing try catch so that flash do not exihibits to a lost page

        // console.log(req.body);
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser =  await User.register(newUser, password);
        console.log(registeredUser);
        
        req.flash("success", "Welcome to WONDERLAND!");
        res.redirect("/listings");
    }
    catch(err){     // noow by this catch error will be displayed in form of flash on the very same page.
        req.flash("error", err.message);    
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
});

module.exports = router;
