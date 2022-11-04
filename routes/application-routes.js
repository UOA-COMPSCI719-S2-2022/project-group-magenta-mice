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
    // Original code for general/non-login view
    // res.locals.title = "All Articles";
    // const articles  = await articlesDao.retrieveAllArticles();
    // res.locals.articles = articles;
    // console.log(articles);

    // Method failed: If I res.locals.commentsEachArticle (from displayComment), two res at the same place, crash.

    // Join tabls of comments and articles: Can see comments, but 1. retrieveAllCommentsAndArticles() 
    // can't discern comment's username/article author name 
    // 2.One article appears the same time as the comments number    
    const all = await articlesDao.retrieveAllCommentsAndArticles();
    console.log(`all:${all}`); // can't do 2 res. infinate.
    const comments = await articlesDao.retrieveAllComments();
    console.log(`comments:${comments}`);
    res.locals.articles = all;

    



    res.render("home");
});

//Whenever we navigate to /my-articles, verify that we're authenticated. If we are, render the user's articles.
router.get("/my-articles", verifyAuthenticated, async function(req, res) {

    // res.locals.title = "My Articles";
    const user = res.locals.user;
    const userArticles = await articlesDao.retrieveArticlesBy(user.id);
    res.locals.userArticles = userArticles;
    console.log(userArticles);

    res.render("user-articles");
});

//Whenever we navigate to /new-article, verify that we're authenticated. If we are, render the new article editor.
router.get("/new-article", verifyAuthenticated, async function(req, res) {

    res.locals.title = "New Article";
    res.render("article-editor");

});

// Whenever we POST to /submit-article, verify that we're authenticated. If we are, add a new article to the database.
router.post("/submit-article", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;


    const article = {
        title: req.body.title,
        content: req.body.content,
        authorId: user.id
    };

    let tag = {
        name: req.body.tags
    }

    await articlesDao.createArticle(article);

    // Check if matching tags in database
    const tagExists = await articlesDao.checkTagExists(tag.name);

    // if there is a matching tag assign that tag, otherwise create and assign a new tag
    if (tagExists) {
        tag = {
            name: tagExists.name,
            id: tagExists.id
        }
        console.log(`tag exists!`);
    } else {
        await articlesDao.createTag(tag);
        console.log(`creating tag`);
    }

    await articlesDao.createTagMap(article.id, tag.id);


    res.setToastMessage("Article posted!");
    res.redirect("/my-articles");

});


// Whenever we POST to /delete-article, verify that we're authenticated. If we are, delete the selected article from the database.
router.post("/delete-article", verifyAuthenticated, async function(req, res) {

    await articlesDao.deleteArticle(req.body.articleId);
    res.setToastMessage("Article Deleted!");
    res.redirect("/my-articles");

});

router.post("/rating", verifyAuthenticated, async function (req, res) {

    const articles  = await articlesDao.retrieveAllArticles();
    //console.log(`allArticles:${articles}`); // ok

    const article = await articlesDao.retrieveArticleBy(req.body.articleID);
    console.log(`title:${article.title}`); //?
    
    // let article = await articlesDao.retrieveArticle(id);
    console.log(`article:${article}`);

    const rating = req.body.rate;
    const id = req.body.articleID;
    const currentRate = req.body.currentRate;
    const totalRate = parseInt(rating) + parseInt(currentRate);
    console.log(id);
    try {
        await articlesDao.updateRate(totalRate, id);
        res.setToastMessage("Article rated!");
        res.redirect("./login");
    }
    catch (err) {
        res.setToastMessage("Unable to update the rate for this article! plz try again!");
        res.redirect("./login");
    }


});

// Create a comment when a user logs in and am verified.
router.post("/comments", verifyAuthenticated, async function(req, res){
    const user = res.locals.user;
    console.log(user);
    
    const articles  = await articlesDao.retrieveAllArticles();
    const article = await articlesDao.retrieveArticleBy(req.body.articleId);
    const articleId = req.body.articleId;
    console.log(`articleId:${articleId}`);
    await articlesDao.createComment(req.body.comments, articleId, user.id);
    
   
    
    res.setToastMessage("Comment posted!");
    
   
    res.redirect("./login");
});

// This won't work because both /displayComments redirect login w/ and render data, while /login render aricles
// router.get("/displayComments", async function(req, res){
//     const allComments = await articlesDao.retrieveAllComments();
//     console.log(allComments);
//     res.locals.commentsEachArticle = allComments;  

//     const articlesAll  = await articlesDao.retrieveAllArticles();
//     articlesAll.forEach(async function(article){
//         const commentsEachArticle = await articlesDao.retrieveCommentsByArticleId(article.id);
//         res.locals.commentsEachArticle = commentsEachArticle;
//         console.log(`commentsEachArticle:${commentsEachArticle}`);
//         res.redirect("./login"); 
        


//     });
    
// });


//Whenever we navigate to /edit-article, verify that we're authenticated. If we are, render the edit article editor.
router.post("/edit-article", verifyAuthenticated, async function(req, res) {

    res.locals.title = "Edit Article";

    let article = await articlesDao.retrieveArticleBy(req.body.articleId);

    console.log(article);
    article.forEach(function(item){
        res.locals.article = item;
    })

    res.render("article-editor-duplicate");
});

// Whenever we navigate to /update-article, veryify that we're authenticated. If we are update the article.
router.post("/update-article", verifyAuthenticated, async function(req, res) {

    const article = {
        title: req.body.title,
        content: req.body.content,
        id: req.body.articleId
    };

    await articlesDao.removeTags(article);

    let tag = {
        name: req.body.tags
    }

    await articlesDao.editArticle(article);

    // Check if matching tags in database
    const tagExists = await articlesDao.checkTagExists(tag.name);
    console.log(tagExists);

    // if there is a matching tag assign that tag, otherwise create and assign a new tag
    if (tagExists) {
        tag = {
            name: tagExists.name,
            id: tagExists.id
        }
        console.log(`tag exists!`);
    } else {
        await articlesDao.createTag(tag);
        console.log(`creating tag`);
    }

    await articlesDao.createTagMap(article.id, tag.id);

    res.setToastMessage("Article updated successfully!");
    res.redirect("./my-articles");
});

// Whenever we navigate to /search-articles,
router.post("/search-articles", async function(req, res) {
    
    const articles = await articlesDao.searchArticlesBy(req.body.articleSearch);
    res.locals.articles = articles;
    res.locals.articleSearch = req.body.articleSearch;
    res.render("article-search");

});

module.exports = router;