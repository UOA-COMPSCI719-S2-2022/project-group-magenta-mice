const userDao = require("../modules/users-dao.js");

async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

async function addUserToLocalsRetrieve(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.retrieveToken);
    res.locals.user = user;
    next();
}

// add cookie function for article test
async function addArticletoLocalsRetrieve(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.retrieveToken);
    res.locals.user = user;
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("/");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated,
    addUserToLocalsRetrieve
}