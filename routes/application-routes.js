const express = require("express");
const router = express.Router();


const articlesDao = require("../modules/articles-dao.js");
const usersDao = require("../modules/users-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");


// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", verifyAuthenticated, async function (req, res) {
    res.locals.title = "All Articles";
    const articles  = await articlesDao.retrieveAllArticles();
    res.locals.articles = articles;
    res.render("home");
});


router.get("/new-article", async function(req, res) {

    res.render("article-editor");
});

// Need the users-dao.js to access user id

/*router.get("/my-articles", async function(req, res) {

    res.locals.title = "My Articles";
    const user = res.locals.user;
    res.locals.allUserArticles = await articlesDao.retrieveArticlesBy(user.id);

    res.render("user-articles");
});*/


module.exports = router;