const express = require("express");
const router = express.Router();
const usersDao = require("../modules/users-dao.js");
const bcrypt = require("bcrypt");



// Creat new account button
router.get("/newAccount", function (req, res) {

    res.render("new-account");
});



// Create a new account w/ the submitted data

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    
router.post("/submit", async function (req, res) {
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
    

    res.cookie("userCookie", user);

    if(user.password !== user.confirmedPassword){
        res.setToastMessage("Passwords must be the same!");
        res.redirect("./newAccount");


    };

    if (user.password === user.confirmedPassword) {
        await usersDao.createUser(user);
        res.setToastMessage("Account created successfully!");
        res.redirect("./login");
    };



});



module.exports = router;