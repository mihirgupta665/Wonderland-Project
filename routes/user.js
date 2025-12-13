const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignUpForm)       // rendering signup form
    .post(asyncWrap(userController.signUp));      // creating account for user


router.route("/login")
    .get(userController.renderLogInForm)        // rendering login form
    .post(userController.logIn);        // mechanism login in the user


// router.post(
//     "/login",
//     passport.authenticate("local", {      // ✅ NO asyncWrap here
//         failureFlash: true,
//         failureRedirect: "/login"
//     }),
//     (req, res) => {
//         // This runs only on SUCCESS
//         req.flash("success", "Welcome back!");
//         res.redirect("/listings");        // or wherever you want
//     }
// );


router.get("/logout", userController.logOut);


module.exports = router;
