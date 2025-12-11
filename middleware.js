module.exports.isLoggedIn = (req, res, next) => {
    // console.log("user : ", req.user);
                // rel path        // full path after localhost
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        // console.log("Original Url : ",req.originalUrl);
        req.session.returnTo = req.originalUrl;         // saving the originalUrl in the session
        // console.log(req.session);
        req.flash("error", "Please Login to Proceed!");
        return res.redirect("/login");
    }
    next();
}