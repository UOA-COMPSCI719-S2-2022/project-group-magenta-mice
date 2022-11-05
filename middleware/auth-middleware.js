const userDao = require("../modules/users-dao.js");

// Retreive a user by assessing authoToken cookie and render the user to view
async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

// Retreive a user by assessing authoToken cookie and render the user to view
async function addUserToLocalsRetrieve(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.retrieveToken);
    res.locals.user = user;
    next();
}

// If users are log in, verify them and proceed with next page. Otherwise, redirect to
// homepage.
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