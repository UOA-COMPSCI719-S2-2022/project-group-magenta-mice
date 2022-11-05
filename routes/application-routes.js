const express = require("express");
const router = express.Router();
const fs = require("fs");
const articlesDao = require("../modules/articles-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

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
});

// Whenever we POST to /submit-article, verify that we're authenticated. If we are, add a new article + tags to the database.
router.post("/submit-article", verifyAuthenticated, async function (req, res) {

    const user = res.locals.user;
    const tagString = req.body.tags;
    const tagArray = tagString.split(',').filter(element => element !== '');

    const article = {
        title: req.body.title,
        content: req.body.content,
        authorId: user.id
    };

    await articlesDao.createArticle(article);

    // Check if matching tags in database
    for (let index = 0; index < tagArray.length; index++) {
        const tag = tagArray[index];
        const tagExists = await articlesDao.checkTagExists(tag);
        res.locals.tagExists = tagExists;

        // if tag exists, assign that tag
        if (tagExists) {
            let tag = {
                name: tagExists.name,
                id: tagExists.id
            }
            //console.log(`tag exists!`);
            await articlesDao.createTagMap(article.id, tag.id);

        // if no tag exists, create and assign that tag
        } else {
            await articlesDao.createTag(tag);
            const newTag = await articlesDao.checkTagExists(tag);
            //console.log(`creating tag`);
            //console.log(newTag);
            await articlesDao.createTagMap(article.id, newTag.id);
        }
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

// When we log in and am verified, we can rate an article and the rating score displays by the article.
router.post("/rating", verifyAuthenticated, async function (req, res) {

    const articles  = await articlesDao.retrieveAllArticles();
    const article = await articlesDao.retrieveArticleBy(req.body.articleID);
    const rating = req.body.rate;
    const id = req.body.articleID;
    const currentRate = req.body.currentRate;
    const totalRate = parseInt(rating) + parseInt(currentRate);
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

//Whenever we navigate to /edit-article, verify that we're authenticated. If we are, render the edit article editor.
router.post("/edit-article", verifyAuthenticated, async function(req, res) {

    res.locals.title = "Edit Article";

    const article = await articlesDao.retrieveArticleBy(req.body.articleId);
    const tags = await articlesDao.retrieveTagsBy(req.body.articleId);
    res.locals.tags = tags;

    article.forEach(function(item){
        res.locals.article = item;
    })

    res.render("article-editor-duplicate");
});

// Whenever we navigate to /view-article retrieve relevant article and render the article-comments page
router.post("/view-article", async function(req, res) {

    res.locals.title = "Article";

    const article = await articlesDao.retrieveArticleBy(req.body.articleId);
    const comments = await articlesDao.retrieveCommentsBy(req.body.articleId);
    const tags = await articlesDao.retrieveTagsBy(req.body.articleId);
    res.locals.comments = comments;
    res.locals.tags = tags;
    article.forEach(function(item){
        res.locals.article = item;
    });

    res.render("article-comments");
});

// Whenever we navigate to /update-article, veryify that we're authenticated. If we are update the article.
router.post("/update-article", verifyAuthenticated, async function(req, res) {

    const article = {
        title: req.body.title,
        content: req.body.content,
        id: req.body.articleId
    };

    await articlesDao.editArticle(article);
    await articlesDao.removeTags(article);

    // Split the tag string into separate tag array
    const tagString = req.body.tags;
    const tagArray = tagString.split(',').filter(element => element !== '');

    // Check if matching tags in database
    for (let index = 0; index < tagArray.length; index++) {
        const tag = tagArray[index];
        const tagExists = await articlesDao.checkTagExists(tag);
        res.locals.tagExists = tagExists;

        // if tag exists, assign that tag
        if (tagExists) {
            let tag = {
                name: tagExists.name,
                id: tagExists.id
            }
            //console.log(`tag exists!`);
            await articlesDao.createTagMap(article.id, tag.id);

        // if no tag exists, create and assign that tag
        } else {
            await articlesDao.createTag(tag);
            const newTag = await articlesDao.checkTagExists(tag);
            //console.log(`creating tag`);
            //console.log(newTag);
            await articlesDao.createTagMap(article.id, newTag.id);
        }
      }
    const tagExists = await articlesDao.checkTagExists(tag.name);

    // if there is a matching tag assign that tag, otherwise create and assign a new tag
    if (tagExists) {
        tag = {
            name: tagExists.name,
            id: tagExists.id
        }
   
    } else {
        await articlesDao.createTag(tag);
    }

    await articlesDao.createTagMap(article.id, tag.id);
    res.setToastMessage("Article updated successfully!");
    res.redirect("./my-articles");
});

// Whenever we navigate to /search-articles, search for matching or similar tags and render the article-search page
router.post("/search-articles", async function(req, res) {
    
    const articles = await articlesDao.searchArticlesBy(req.body.articleSearch);
    res.locals.articles = articles;
    res.locals.articleSearch = req.body.articleSearch;
    res.render("article-search");

});

//When we log in and am verified, we can create a comment and it is stored in database. Then 307 refreshes the page
// and we are redirected to view-article.
router.post("/comments", verifyAuthenticated, async function(req, res){
    
    const user = res.locals.user;
    const articleId = req.body.articleId;
    await articlesDao.createComment(req.body.comments, articleId, user.id);
    res.setToastMessage("Comment posted!");
    res.redirect(307, "./view-article"); //307 allows us to route to post, keeps article loaded intact
});

module.exports = router;