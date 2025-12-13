const User = require("../models/user");


module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
}

module.exports.signUp = async (req, res, next) => {
    try {    // writing try catch so that flash do not exihibits to a lost page

        // console.log(req.body);
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.logIn(registeredUser, (err) => {
            if (err) {
                console.log("Sign-up -> login error");
                return next(err);
            }
            req.flash("success", "Welcome to WONDERLAND!");
            return res.redirect("/listings");
        });
    }
    catch (err) {     // now by this catch error will be displayed in form of flash on the very same page.
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logIn = async (req, res, next) => {
    // console.log("LOGIN ROUTE HIT, BODY:", req.body);
    // console.log("return to login : ", req.session.returnTo);
    res.locals.saveRedirect = req.session.returnTo;
    // here  in js res.locals.varaiable_name is required to access the local variable
    // console.log(res.locals.saveRedirect);       // saveRedirect could eb directly written in ejs file only
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
            // console.log("returnTo : ", req.session.returnTo);
            // console.log(req.session);
            // delete req.session.returnTo;
            return res.redirect(res.locals.saveRedirect || "/listings");
        });
    } catch (e) {
        // console.error("LOGIN OUTER ERROR:", e);
        next(e);
    }
}

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {     // call back will always be called if there is no error then err is undefined.
        if (err) {
            return next(err);
        }
        req.flash("success", "User is Logout Successfully!");
        res.redirect("/listings");
    });
}