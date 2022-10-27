const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createArticle(title, content, author) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into articles (title, content, author, timestamp)
        values(${title}, ${content}, ${author}, datetime('now'))`);
}

async function retrieveAllArticles() {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`select * from articles`);

    return allArticles;
}

async function retrieveArticlesBy(userID) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content'
        from articles a, users u
        where u.id = ${userID}
        and a.id = u.id
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