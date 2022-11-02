const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");

const Comment = require ("../middleware/comments.js")


const articlesDao = require("../modules/articles-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/users-dao");

// Whenever we navigate to / render the home view.
router.get("/login", async function (req, res) {
    res.locals.title = "All Articles";
    const articles  = await articlesDao.retrieveAllArticles();


    res.locals.articles = articles;
    console.log(articles);
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

    //const user = res.locals.user;
    //console.log(user);
});

// Whenever we POST to /submit-article, verify that we're authenticated. If we are, add a new article to the database.
router.post("/submit-article", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;

    await articlesDao.createArticle(req.body.title, req.body.content, user.id, req.body.tags);

    res.setToastMessage("Article posted!");
    res.redirect("./my-articles");

});


// Whenever we POST to /delete-article, verify that we're authenticated. If we are, delete the selected article from the database.
router.post("/delete-article", verifyAuthenticated, async function(req, res) {

    await articlesDao.deleteArticle(req.body.articleId);
    res.setToastMessage("Article Deleted!");
    res.redirect("/my-articles");

});

// Whenever we navigate to /search-articles, search for the articles with relevant tags and render the search view
router.post("/search-articles", async function (req, res) {

    const articleSearch = req.body.articleSearch;
    res.locals.articleSearch = articleSearch;

    const articles  = await articlesDao.searchArticlesBy(req.body.articleSearch);
    res.locals.articles = articles;
    
    res.locals.title = `Results for ${articleSearch}`; //at the moment searches for exact matches in tags, could change to search for close matches too?

    console.log(articles);

    res.render("article-search");

});

router.post("/rating", verifyAuthenticated, async function (req, res) {
    const articles  = await articlesDao.retrieveAllArticles();
    //console.log(`allArticles:${articles}`); // ok

    const article = await articlesDao.retrieveArticleBy(req.body.articleID);
    console.log(`title:${article.title}`); //?
    


    const id = req.body.articleID;
    // let article = await articlesDao.retrieveArticle(id);
    console.log(`article:${article}`);
    

    const rating = req.body.rate;
    

    const currentRate = req.body.currentRate;
    const totalRate = parseInt(rating) + parseInt(currentRate);
    console.log(id);

    try {
        await articlesDao.updateRate(totalRate, id);

        articles.forEach(function(item){
            res.locals.article = item;
        });
        
        
        res.setToastMessage("Article rated!");
        res.redirect("./login");
    }
    catch (err) {
        res.setToastMessage("Unable to update the rate for this article! plz try again!");
        res.redirect("./login");
    }


});


router.post("/comments", verifyAuthenticated, async function(req, res){
   /* Comment.create(req.body).then((comment){
        console.log(comment)
        res.redirect(`/${comment.userId}`);
    }). catch ((err){
        console.log(err.message);
    });*/
    res.send("review comments");
});

//Whenever we navigate to /edit-article, verify that we're authenticated. If we are, render the edit article editor.
router.post("/edit-article", verifyAuthenticated, async function(req, res) {

    //res.locals.title = "Edit Article";

    let article = await articlesDao.retrieveArticleBy(req.body.articleId);
    article.forEach(function(item){
        res.locals.article = item;
    })
    
    res.render("article-editor-duplicate");
});


module.exports = router;