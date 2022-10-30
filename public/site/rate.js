window.addEventListener("load", function () {

    // async function rateArticle (req, res) {
    //     try {
    //         await articlesDao.updateUser(user);
    //         res.cookie("authToken", authToken);
    //         res.locals.user = user;
    //         res.redirect("/");
    //     }
    //     catch (err) {
    //         res.setToastMessage("update user failed");
    //         res.redirect("./login");
    //     }
    //
    // }
    // const articlesDao = require("../modules/articles-dao.js");
    // const sqlite3 = require('sqlite3').verbose();

    // let db = new sqlite3.Database('./project-database.db');
    // var inputData = [req.body., req.body., id];
    //
    // db.run("UPDATE f11 SET GIVENNAME=?, SURNAME=? WHERE id=?",inputData,function(err,rows){
    // ....
    // });

    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
        const formData = new FormData(event.target);
        const rating = formData.get('rating');
        console.log(rating);
        event.preventDefault();
    });

});