const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require ('bcrypt');

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");
require("../modules/users-dao");

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.render("login");
    }

});


// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;
    // console.log(password)

    // Find a matching user in the database
    const user = await userDao.retrieveUserByUsername(username);
    // console.log(user)

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
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.clearCookie("userCookie");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

//allows user to delete the user account and clear the local cookie
router.get("/delete", async function (req, res) {
    if (res.locals.user) {
        // console.log(res.locals.user)
        try {
            await userDao.deleteUser(res.locals.user.id);
            res.clearCookie("authToken");
            res.locals.user = null;
            res.setToastMessage("Account deleted successfully!");
            res.redirect("./login");
        }
        catch (err) {
            res.setToastMessage("Account deleted failed!");
            res.render("login");
        }
    }
    else {
        res.render("login");
    }
});

// Whenever we navigate to /edit, check the locals information, otherwise,
// redirect to "/login", then ask to login again.
router.get("/edit", async function (req, res) {
    if (res.locals.user) {
        res.render("edit-account", res.locals.user);
        console.log(res.locals.user)
    }
    else {
        res.render("login");
    }
});

// Whenever we navigate to /edit post, update all the properties the by user.id
// check the user password and bcrypt it, if user already exist then lead to edit page
router.post("/edit", async function (req, res) {
    // Find a matching user in the database

    const userView = await userDao.retrieveUserByUsername(res.locals.user.name);
    // console.log(userView)

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);

    const user = {
        id: userView.id,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        confirmedPassword: await bcrypt.hash(req.body.confirmedPassword, salt),
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        avatar: req.body.avatar,
        introduction: req.body.introduction
    };

    res.cookie("userCookie", user);

    if(user.password !== user.confirmedPassword){
        res.setToastMessage("Passowrds must be the same!");
        res.redirect("./edit");

    }else if(user.password === "" && user.confirmedPassword === ""){
        res.setToastMessage("Enter passwords!");
        res.redirect("./edit");

    }else {
        try {
            console.log(user)
            await userDao.editUser(user);
            res.setToastMessage("Account updated successfully!");
            res.redirect("/");

        } catch (err) {
            res.setToastMessage("Account updated failed!");
            res.redirect("/edit");
        }
    }

});

/*
// Account creation
router.get("/newAccount", function (req, res) {
    res.render("new-account");
})

router.post("/newAccount", async function (req, res) {

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);

    const user = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        name: req.body.name
    };

    try {
        await userDao.createUser(user);
        res.setToastMessage("Account creation successful. Please login using your new credentials.");
        res.redirect("/login");
    }
    catch (err) {
        res.setToastMessage("That username was already taken!");
        res.redirect("/newAccount");
    }

});*/

module.exports = router;