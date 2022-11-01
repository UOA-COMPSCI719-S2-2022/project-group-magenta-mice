
const express = require("express");
const router = express.Router();


const userDao = require("../modules/users-dao.js");

const { addUserToLocalsRetrieve } = require("../middleware/auth-middleware.js");

router.get("/reset", addUserToLocalsRetrieve,  function(req, res){
    
    res.render("reset-password");
});

router.post("/resetSubmitted",  async function(req, res){
    const username = req.body.username;
    const newPassword = req.body.password;
    const nconfirmedP = req.body.confirmedPassword;
    
    

   
    let user = await userDao.retrieveUserByUsername(username);
    const email = user.email;
    const authToken = user.authToken;
    const avatar = user.avatar;
    const introduction = user.introduction;
    

    
    
    if(newPassword !== nconfirmedP ){
        
        res.setToastMessage("Same passwords @@");
        
    }else{
        
        
        user = {
            username: username,
            password: newPassword,
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