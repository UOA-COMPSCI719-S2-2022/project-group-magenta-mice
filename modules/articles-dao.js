const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createArticle(title, content, authorId) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into articles (title, content, authorId, timestamp)
        values(${title}, ${content}, ${authorId}, datetime('now'))`);
}

async function retrieveAllArticles() {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`select * from articles`);

    return allArticles;
}

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

async function deleteArticle(id) {
    const db = await dbPromise;

    await db.run(SQL`delete from articles where id = ${id}`);
}

// Export functions.
module.exports = {
    createArticle,
    retrieveAllArticles,
    retrieveArticlesBy,
    deleteArticle
};