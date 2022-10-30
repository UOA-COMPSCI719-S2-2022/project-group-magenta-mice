const express = require("express");
const router = express.Router();
const usersDao = require("../modules/users-dao.js");
const bcrypt = require("bcrypt");

function keepUnsuccessfulPasswords(req, res, next) {

    const thisCookie = req.cookies.userCookie;    
    if (thisCookie !== undefined) {
        
        res.locals.username = thisCookie.username;
        res.locals.password = thisCookie.password;
        res.locals.confirmedPassword = thisCookie.confirmedPassword;
        res.locals.name = thisCookie.name;
        res.locals.birthday = thisCookie.birthday;
        res.locals.email = thisCookie.email;
        
        res.locals.avatar = thisCookie.avatar;
        // if(res.locals.avatar === "blue.png"){
        //     res.locals.avatar = true;
        // }

        
        //console.log(`res.locals.avatar:${res.locals.avatar}`); //res.locals.avatar:blue.png
        res.locals.introduction = thisCookie.introduction;
        console.log(``);
        
    }
    next();
}

// Creat new account button
router.get("/newAccount", keepUnsuccessfulPasswords, function (req, res) {
    
    res.render("new-account");
});



// Create a new account w/ the submitted data
router.post("/submit", async function(req, res){
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const user ={
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        confirmedPassword: await bcrypt.hash(req.body.confirmedPassword, salt),
        name: req.body.name,
        birthday: req.body.birthday,
        email: req.body.email,
        avatar: req.body.avatar,
        introduction: req.body.introduction
        
    };
    // console.log(`user:${res.json(user)}`); //works!

    res.cookie("userCookie", user);

    if(user.password !== user.confirmedPassword){
        res.setToastMessage("Passowrds must be the same!");
        res.redirect("./newAccount");

    }else if(user.password === "" && user.confirmedPassword === ""){
        res.setToastMessage("Enter passwords!");
        res.redirect("./newAccount");

    }else{
        await usersDao.createUser(user);
        res.setToastMessage("Account created successfully!");
        // res.redirect("./newAccount");
        res.redirect("./login");
    }


});



module.exports = router;