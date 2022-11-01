const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


// Create new article
async function createArticle(title, content, userId) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into articles (title, content, userId, timestamp)
        values(${title}, ${content}, ${userId}, datetime('now'))`);
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
async function retrieveArticle(id) {
    const db = await dbPromise;

    const article = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'oldContent', a.title as 'oldTitle', u.name as 'name', a.id as 'articleId' 
        from articles a, users u
        where a.id=${id}`);

    return article;
}

// Retrieve all articles
async function retrieveAllArticles() {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId' 
        from articles a, users u
        order by a.timestamp desc`);

    return allArticles;
}

// Retrieve user's articles
async function retrieveArticlesBy(userID) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId' 
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

// Export functions.
module.exports = {
    createArticle,
    editArticle,
    retrieveAllArticles,
    retrieveArticlesBy,
    deleteArticle,
    retrieveArticle
};