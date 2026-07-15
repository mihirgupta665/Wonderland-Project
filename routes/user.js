const express = require("express");
const User = require("../models/user.js");
const asyncWrap = require("../utility/asyncWrap.js");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js");


router.route("/signup")
    .get(userController.renderSignUpForm)       // rendering signup form
    .post(asyncWrap(userController.signUp));      // creating account for user

router.route("/login")
    .get(userController.renderLogInForm)        // rendering login form
    .post(
        saveRedirectUrl,
        async (req, res, next) => {
            // Dual login pre-processor: if they entered an email address, lookup their actual username
            if (req.body.username && req.body.username.includes("@")) {
                try {
                    const user = await User.findOne({ email: req.body.username });
                    if (user) {
                        req.body.username = user.username;
                    }
                } catch (err) {
                    console.error("Email login preprocessing error:", err);
                }
            }
            next();
        },
        (req, res, next) => {
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("error", info ? info.message : "Incorrect username or password!");
                    return res.redirect("/login");
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    req.flash("success", "Welcome back to WONDERLAND!");
                    let redirectUrl = res.locals.saveRedirect || "/listings";
                    res.redirect(redirectUrl);
                });
            })(req, res, next);
        }
    );

router.get("/logout", userController.logOut);

module.exports = router;
