const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


const userDao = require("../modules/users-dao.js");

router.get("/retrieve", function(req, res){
    
    res.render("retrieve");
});

router.post("/retrieveSubmitted", async function(req, res){
    const username = req.body.username;
    const email = req.body.email;
    

   
    const user = await userDao.retrieveUserByUsername(username);
    

    if(user === undefined){
        res.setToastMessage("Username not existed");
        res.redirect("./retrieve");

        
    }else if(user.email !== email){
        res.setToastMessage("Wrong email ><");
        res.redirect("./retrieve");

        
    }else{
        
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
       

        res.cookie("retrieveToken", authToken);

        res.locals.user = user;
        
        res.redirect("./reset");

        
        
    };
    
    
});




module.exports = router;