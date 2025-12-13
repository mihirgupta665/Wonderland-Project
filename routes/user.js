const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");
const passport = require("passport");

const router = express.Router();
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", asyncWrap(userController.signUp));

router.get("/login", userController.renderLogInForm);

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


router.post("/login", userController.logIn);

router.get("/logout", userController.logOut);



module.exports = router;
