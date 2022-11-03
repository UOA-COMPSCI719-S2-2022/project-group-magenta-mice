const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


// Create new article
async function createArticle(article) {
    const db = await dbPromise;


    const result = await db.run(SQL`
        insert into articles (title, content, authorId, timestamp)
        values(${article.title}, ${article.content}, ${article.authorId}, datetime('now'))`);

    article.id = result.lastID;
    console.log(`article id = ${article.id}`);
}

// Create a new tag
async function createTag(tag) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into tags(name)
        values(${tag.name})`);

    tag.id = result.lastID;
    console.log(`tag id = ${tag.id}`);
}

// Check if a tag already exists, returns undefined if not found
async function checkTagExists(tag) {
    const db = await dbPromise;

    const tagExists = await db.get(SQL`
    select * from tags
    where name = ${tag}`);

    return tagExists;
}

async function removeTags(article) {
    const db = await dbPromise;

    await db.run(SQL`delete from tagmap where articleId = ${article.id}`);
}

// Create the tagmap links between articles and tags
async function createTagMap(articleId, tagId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into tagmap(articleId, tagId)
        values(${articleId}, ${tagId})`);

}

// Edit article, replace values except timestamp
// Should add an -edited- tag? symbol?
async function editArticle(article) {
    const db = await dbPromise;

    await db.run(SQL`
        update articles
        set title = ${article.title}, content = ${article.content}
        where id=${article.id}`);
}

// Retrive article by article ID
async function retrieveArticleBy(id) {
    const db = await dbPromise;

    const article = await db.all(SQL`
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.tags as 'tags'
        from articles a, users u
        where a.id=${id} and a.authorId=u.id`);

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

    console.log(articleSearch);
     
     const stmt = await db.prepare(SQL`select a.timestamp as 'timestamp',         
     a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId',         
     t.name as 'tag', a.rate as 'rate' from articles 
     as a join tagmap tm 
     on a.id = tm.articleId 
     join users u 
     on a.authorId = u.id 
     join tags t on tm.tagId = t.id          
     where LOWER(t.name) LIKE LOWER(?)`);    
     await stmt.bind(`%${articleSearch}%`);  

     const articles = await stmt.all();

    console.log(articles);
    return articles;
}

async function updateRate(rate, articleID) {
    const db = await dbPromise;

    await db.run(SQL`update articles set rate = ${rate} where id = ${articleID}`);
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
    createTag,
    createTagMap,
    checkTagExists,
    removeTags,
    updateRate
};