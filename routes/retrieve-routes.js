const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { addUserToLocalsRetrieve } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/users-dao.js");

// When we forgot passwords, we can press the retrieve button to reset passwords.
router.get("/retrieve", function (req, res) {
    res.render("retrieve");
});

// When we provide our username and email, we will be verifed and redirected to reset-password-page. 
router.post("/retrieveSubmitted", async function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const user = await userDao.retrieveUserByUsername(username);
    if (user === undefined) {
        res.setToastMessage("Username not existed");
        res.redirect("./retrieve");
    } else if (user.email !== email) {
        res.setToastMessage("Wrong email ><");
        res.redirect("./retrieve");
    } else {
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("retrieveToken", authToken);
        res.locals.user = user;
        res.redirect("./reset");
    };
});

// When we are redirected to reset-password page, our username is rendered.
router.get("/reset", addUserToLocalsRetrieve, function (req, res) {
    res.render("reset-password");
});

// When we inputs passwords in the reset-password page, check whether passowrds are the same.
// If passwords are the same, generate salt to hash the new password and update users database.
router.post("/resetSubmitted", async function (req, res) {
    const username = req.body.username;
    const newPassword = req.body.password;
    const nconfirmedP = req.body.confirmedPassword;
    let user = await userDao.retrieveUserByUsername(username);
    const email = user.email;
    const authToken = user.authToken;
    const avatar = user.avatar;
    const introduction = user.introduction;
    if (newPassword !== nconfirmedP) {
        res.setToastMessage("Same passwords @@");
    } else {
        const salt = await bcrypt.genSalt(10);
        user = {
            username: username,
            password: await bcrypt.hash(newPassword, salt),
            email: email,
            avatar: avatar,
            authToken: authToken,
            introduction: introduction
        }
        user = await userDao.updateUser(user);
        res.setToastMessage("Passwords reset successfully!");
    };
    res.redirect("./reset");

});
module.exports = router;