const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// Create a new tag
async function createTag(tag) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into tags (tag)
        values(${tag})`);
}

// Retrieve a tag's id
async function retrieveTagId(tag) {
    const db = await dbPromise;

    const tagId = await db.all(SQL`
        select t.id as 'tagId' 
        from tags t
        where t.tag=${tag}`);

    return tagId;
}

// Create a new tag-article link on the tagmap table
async function createTagLink(articleId, tagId) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into tagmap (articleId, tagId)
        values(${articleId}, ${tagId})`)
}

// Check if the tag exists already 
async function checkTagExists(tag) {
    const db = await dbPromise;

    await db.run(SQL``);

}

// Delete tag, useful when deleting articles/user + articles
async function deleteTag(tag) {
    const db = await dbPromise;
}

// Export functions.
module.exports = {
    checkTagExists,
    createTag,
    createTagLink,
    retrieveTagId
};