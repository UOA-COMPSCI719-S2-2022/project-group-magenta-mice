const express = require("express");
const router = express.Router();
const usersDao = require("../modules/users-dao.js");



// Creat new account button
router.get("/newAccount", function (req, res) {

    res.render("new-account");
});



// Create a new account w/ the submitted data
router.post("/submit", async function (req, res) {
    const user = {
        username: req.body.username,
        password: req.body.password,
        confirmedPassword: req.body.confirmedPassword,
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        avatar: req.body.avatar,
        introduction: req.body.introduction

    };

    if (user.password === user.confirmedPassword) {
        await usersDao.createUser(user);
        res.setToastMessage("Account created successfully!");
        res.redirect("./login");
    };



});



module.exports = router;