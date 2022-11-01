const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// Check if new tag exists
async function checkTagExists(tag) {
    const db = await dbPromise;

}

// Create new tag
async function createTag(tag) {
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
    createTag
};