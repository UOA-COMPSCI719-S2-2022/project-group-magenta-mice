const express = require("express");
const router = express.Router();
const userDao = require("../modules/users-dao.js");

const bcrypt = require("bcrypt");

// Creat new account button
router.get("/newAccount", function (req, res) {

    res.render("new-account");
});



// Create a new account and generate salt to hash password     
router.post("/submit", async function (req, res) {
    const salt = await bcrypt.genSalt(10);
    const user = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        confirmedPassword: await bcrypt.hash(req.body.confirmedPassword, salt),
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        avatar: req.body.avatar,
        introduction: req.body.introduction


    };

    if (user.password === user.confirmedPassword) {
        await userDao.createUser(user);
        res.setToastMessage("Account created successfully!");
        res.redirect("./login");
    };



});

// Verify username availability 
router.get("/checkUsername", async function(req, res){
    
    const username= req.query.username;
    console.log(`usernameCheck:${username}`); // ok

    const user = await userDao.retrieveUserByUsername(username);
    console.log(user);

        try{ 
            
            if(user){
            
                res.json("Username existed already!");
            };
            
            
        }catch(err){

            res.json(user.username);

            
            
        }


});

//allows user to delete the user account and clear the local cookie
router.get("/delete", async function (req, res) {
    if (res.locals.user) {

        try {
            await userDao.deleteUser(res.locals.user.id);
            res.clearCookie("authToken");
            res.locals.user = null;
            res.setToastMessage("Account deleted successfully!");
            res.redirect("./login");
        }
        catch (err) {
            res.setToastMessage("Account deleted failed!");
            res.render("home");
        }
    }
    else {
        res.render("home");
    }
});

// Whenever we navigate to /edit, check the locals information, otherwise,
// redirect to "/home", then ask to home again.
router.get("/edit", async function (req, res) {
    if (res.locals.user) {
        res.render("edit-account", res.locals.user);
        console.log(res.locals.user)
    }
    else {
        res.render("edit-account");
    }
});

// Whenever we navigate to /edit post, update all the properties the by user.id
// check the user password and bcrypt it, if user already exist then lead to edit page
router.post("/edit", async function (req, res) {
    // Find a matching user in the database

    const userView = await userDao.retrieveUserByUsername(res.locals.user.username);
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

    if (user.password !== user.confirmedPassword) {
        res.setToastMessage("Passowrds must be the same!");
        res.redirect("./edit");

    } else if (user.password === "" && user.confirmedPassword === "") {
        res.setToastMessage("Enter passwords!");
        res.redirect("./edit");

    } else {
        try {
            console.log(user)
            await userDao.editUser(user);
            res.setToastMessage("Account updated successfully!");
            res.redirect("./login");

        } catch (err) {
            res.setToastMessage("Account updated failed! This username existed already.");
            res.redirect("./edit");
        }
    }

});








module.exports = router;