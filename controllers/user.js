const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        
        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WONDERLAND!");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req, res) => {
    const referer = req.get("Referer");
    if (referer && referer.includes(req.headers.host) && !referer.includes("/login") && !referer.includes("/signup")) {
        req.session.returnTo = referer;
    }
    res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to WONDERLAND!");
    let redirectUrl = res.locals.saveRedirect || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have successfully logged out!");
        res.redirect("/listings");
    });
};