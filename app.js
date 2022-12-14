/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
///app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({limit: '50mb', extended: true})); //changed this to allow bigger file uploads thru tinymce

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Use middlewares
const { toaster } = require("./middleware/toaster-middleware.js");
app.use(toaster);
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup routes
app.use(require("./routes/application-routes.js"));
app.use(require("./routes/create-account-routes.js"));
app.use(require("./routes/auth-routes.js"));
app.use(require("./routes/admin-routes.js"));
app.use(require("./routes/retrieve-routes.js"));

/* New Route to the TinyMCE Node module + TinyMCE */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use('/tinymce', express.static(path.join(__dirname, 'middleware')));

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});