const express = require("express");
const router = express.Router();

const articlesDao = require("../modules/articles-dao.js");
const usersDao = require("../modules/users-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

// Whenever we navigate to / render the home view.
router.get("/", async function (req, res) {
    res.locals.title = "All Articles";
    const articles  = await articlesDao.retrieveAllArticles();
    res.locals.articles = articles;
    res.render("home");
});

//Whenever we navigate to /my-articles, verify that we're authenticated. If we are, render the user's articles.
router.get("/my-articles", verifyAuthenticated, async function(req, res) {

    res.locals.title = "My Articles";
    const user = res.locals.user;
    const userArticles = await articlesDao.retrieveArticlesBy(user.id);
    res.locals.userArticles = userArticles;

    res.render("user-articles");
});

//Whenever we navigate to /new-article, verify that we're authenticated. If we are, render the new article editor.
router.get("/new-article", verifyAuthenticated, async function(req, res) {

    res.locals.title = "New Article";
    res.render("article-editor");

    const user = res.locals.user;
    //console.log(user);
});

// Whenever we POST to /submit-article, verify that we're authenticated. If we are, add a new article to the database.
router.post("/submit-article", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;

    await articlesDao.createArticle(req.body.title, req.body.content, user.id);
    res.setToastMessage("Article posted!");
    res.redirect("/my-articles");

});

// Whenever we POST to /delete-article, verify that we're authenticated. If we are, delete the selected article from the database.
router.post("/delete-article", verifyAuthenticated, async function(req, res) {

    //article = req.body.id;
    await articlesDao.deleteArticle(req.body.articleId);
    console.log(req.body.articleId);
    res.setToastMessage("Article Deleted!");
    res.redirect("/my-articles");

});

//Whenever we navigate to /edit-article, verify that we're authenticated. If we are, render the edit article editor.
// WORKING ON THIS
/*router.get("/edit-article", verifyAuthenticated, async function(req, res) {

    res.locals.title = "Edit Article";
    res.render("article-editor");

    const user = res.locals.user;
    console.log(user);
});*/

module.exports = router;