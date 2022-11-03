const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


// Create new article
async function createArticle(title, content, authorId, tags) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into articles (title, content, authorId, timestamp, tags)
        values(${title}, ${content}, ${authorId}, datetime('now'), ${tags})`);
}

// Edit article, replace values except timestamp
// Should add an -edited- tag? symbol?
async function editArticle(article) {
    const db = await dbPromise;
    await db.run(SQL`
        update articles
        set title = ${article.title}, content = ${article.content}
        where id = ${article.id}`);
}

// Retrive article by article ID
async function retrieveArticleBy(id) {
    const db = await dbPromise;

    const article = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.tags as 'tags'
        from articles a, users u
        where a.id=${id} and a.authorID=u.id`);

    return article;
}


// Retrieve an article's ID
async function retrieveArticleId(title, content, user) {
    const db = await dbPromise;

    const articleId = await db.all(SQL`
        select a.id as 'articleId' 
        from articles a
        where a.title=${title} and a.content=${content} and a.authorId=${user}`);

    return articleId;
}

// Retrieve all articles
async function retrieveAllArticles() {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`

        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.tags as 'tags',a.rate as 'rate', a.id as 'id' 

        from articles a, users u
        where a.authorID = u.id
        order by a.timestamp desc`);

    return allArticles;
}

// Retrieve user's articles
async function retrieveArticlesBy(userID) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.tags as 'tags' 
        from articles a, users u
        where u.id = ${userID}
        and a.authorId = u.id
        order by a.timestamp desc`);

    return articles;
}

// Delete article
async function deleteArticle(id) {
    const db = await dbPromise;

    await db.run(SQL`delete from articles where id = ${id}`);
}


// Retrieve articles by tag
async function searchArticlesBy(articleSearch) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.tags as 'tags', a.rate as 'rate' 
        from articles a, users u
        where tags like ${articleSearch}`);

    return articles;
}

async function updateRate(rate, articleID) {
    const db = await dbPromise;

    await db.run(SQL`update articles set rate = ${rate} where id = ${articleID}`);
}

//create new comment
async function createComment(comments, articleId, userId) {
    const db = await dbPromise;
    await db.run(SQL`
        insert into comments (comments, timestamp, articleId, userId) values(${comments}, ${articleId}, ${userId}, datetime('now'))`);
}

// Export functions.
module.exports = {
    createArticle,
    editArticle,
    retrieveAllArticles,
    retrieveArticlesBy,
    deleteArticle,
    retrieveArticleBy,
    retrieveArticleId,
    searchArticlesBy,
    updateRate,
    createComment,
};