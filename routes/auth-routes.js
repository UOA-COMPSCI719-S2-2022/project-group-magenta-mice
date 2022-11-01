const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");





// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");
require("../modules/users-dao");

const articlesDao = require("../modules/articles-dao.js");

// Whenever we navigate to /home, if we're already logged in, redirect to "/".
// Otherwise, render the "home" view.
router.get("/login", async function (req, res) {

    res.locals.title = "All Articles";
    const articles  = await articlesDao.retrieveAllArticles();
    res.locals.articles = articles;

    if (res.locals.user) {
        
        res.redirect("/");
    }

    else {
        
        
        res.render("home");
    }

});


// Whenever we POST to /home, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/home", with a "home failed" message.
router.post("/login", async function (req, res) {
    

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;
    

    // Find a matching user in the database
    const user = await userDao.retrieveUserByUsername(username);
    

    // if there is a matching user...
    if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
            const authToken = uuid();
            user.authToken = authToken;
            try {
                await userDao.updateUser(user);
                res.cookie("authToken", authToken);
                res.locals.user = user;
                res.redirect("/");
            }
            catch (err) {
                res.setToastMessage("update user failed");
                res.redirect("./login");
            }

        } else {
            // Auth fail
            res.locals.user = null;
            res.setToastMessage("Authentication failed! Password not match! Please try again");
            res.redirect("./login");
        }
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.setToastMessage("Authentication failed! User dose not exist");
        res.redirect("./login");
    }
});

// Whenever we navigate to /logout get, delete the authToken cookie.
// redirect to "/home", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    // res.clearCookie("userCookie");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});



module.exports = router;