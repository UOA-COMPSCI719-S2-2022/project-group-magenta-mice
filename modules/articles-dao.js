const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


// Create new article
async function createArticle(article) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into articles (title, content, authorId, timestamp)
        values(${article.title}, ${article.content}, ${article.authorId}, datetime('now'))`);

    // Get the auto-generated ID value, and assign it back to the article object.
    article.id = result.lastID;
    console.log(`article id = ${article.id}`);
}

// Create a new tag
async function createTag(tag) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into tags(name)
        values(${tag})`);

    // Get the auto-generated ID value, and assign it back to tag object.
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

// Delete tags from article thru tagmap link
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

// Retrieve tags by article id
async function retrieveTagsBy(articleId) {
    const db = await dbPromise;
     
    const tags = await db.all(SQL`
    select t.name
    from articles a, tags t, tagmap tm        
    where a.id = ${articleId}
    AND a.id=tm.articleId
    AND t.id=tm.tagId`);    

    return tags;
}

// Edit article, replace values except timestamp
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
        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId'
        from articles a, users u
        where a.id=${id} and a.authorId=u.id`);

    return article;
}

// Retrieve all articles
async function retrieveAllArticles() {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`

        select a.timestamp as 'timestamp', a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId', a.rate as 'rate', a.id as 'id'

        from articles a, users u
        where a.authorID = u.id
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


// Retrieve articles by tag search
async function searchArticlesBy(tagSearch) {
    const db = await dbPromise;

    console.log(tagSearch);
     
    const stmt = await db.prepare(SQL`select a.timestamp as 'timestamp',         
    a.content as 'content', a.title as 'title', u.name as 'name', a.id as 'articleId',         
    t.name as 'tag', a.rate as 'rate' from articles 
    as a join tagmap tm 
    on a.id = tm.articleId 
    join users u 
    on a.authorId = u.id 
    join tags t on tm.tagId = t.id          
    where LOWER(t.name) LIKE LOWER(?)`);    
    await stmt.bind(`%${tagSearch}%`);  

    const articles = await stmt.all();

    console.log(articles);
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
        insert into comments(comments, timestamp, articleId, userId) 
        values(${comments}, datetime('now'), ${articleId}, ${userId})`);
}

async function retrieveCommentsBy(articleId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select c.timestamp as 'timestamp', c.comments as 'comments', u.name as 'name', u.avatar as 'avatar'
        from comments c, users u
        where c.articleId = ${articleId}
        AND u.id = c.userId
        order by c.timestamp desc`);

    return comments;
}

async function retrieveAllComments() {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select c.timestamp as 'timestamp', c.comments as 'comments', c.articleId as 'articleId'
        from comments c
        `);

    return comments;
}


// Export functions.
module.exports = {
    createArticle,
    editArticle,
    retrieveAllArticles,
    retrieveArticlesBy,
    deleteArticle,
    retrieveArticleBy,
    searchArticlesBy,
    createComment,
    retrieveCommentsBy,
    retrieveAllComments,
    createTag,
    createTagMap,
    checkTagExists,
    removeTags,
    retrieveTagsBy,
    updateRate
};