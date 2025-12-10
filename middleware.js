module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "Please Login to Proceed!");
        return res.redirect("/login");
    }
    next();
}