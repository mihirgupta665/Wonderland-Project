const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");
const passport = require("passport");

const router = express.Router();


router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", asyncWrap(async (req, res) => {
    try {    // writing try catch so that flash do not exihibits to a lost page

        // console.log(req.body);
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.flash("success", "Welcome to WONDERLAND!");
        res.redirect("/listings");
    }
    catch (err) {     // noow by this catch error will be displayed in form of flash on the very same page.
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

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

router.post("/login", async (req, res, next) => {
    // console.log("LOGIN ROUTE HIT, BODY:", req.body);

    const { username, password } = req.body;

    try {
        // 1) Find the user by username in MongoDB
        const user = await User.findOne({ username });
        // console.log("FOUND USER:", user);

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/login");
        }

        // 2) Use PROMISE-BASED instance authenticate
        //    - No callback here
        let authResult;
        try {
            authResult = await user.authenticate(password);
        } catch (err) {
            // console.log("AUTH PROMISE ERROR:", err);
            req.flash("error", err.message || "Authentication error");
            return res.redirect("/login");
        }

        // console.log("AUTH RESULT RAW:", authResult);

        let authUser = authResult && authResult.user ? authResult.user : authResult;
        let passwordError =
            (authResult && (authResult.error || authResult.passwordError)) || null;

        if (passwordError) {
            // console.log("PASSWORD ERROR:", passwordError);
            req.flash(
                "error",
                "Invalid  password!"
            );
            return res.redirect("/login");
        }

        if (!authUser) {
            // console.log("NO AUTH USER, AUTHRESULT:", authResult);
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        // 3) Log the user in (create session)
        req.logIn(authUser, (err) => {
            if (err) {
                // console.log("LOGIN ERROR:", err);
                return next(err);
            }
            req.flash("success", "Welcome back!");
            return res.redirect("/listings");
        });
    } catch (e) {
        // console.error("LOGIN OUTER ERROR:", e);
        next(e);
    }
});










module.exports = router;
