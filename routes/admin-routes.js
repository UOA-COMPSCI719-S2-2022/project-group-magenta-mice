const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");



router.get("/admin", async function(req, res){
    res.json(await userDao.retrieveAllUsers());
    console.log(`await userDao.retrieveAllUsers():${await userDao.retrieveAllUsers()}`);
    console.log("admin router ....");
});


module.exports = router;