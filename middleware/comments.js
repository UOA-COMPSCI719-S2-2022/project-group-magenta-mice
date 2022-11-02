const { default: mongoose, Schema } = require("mongoose");

const Comment=  mongoose.model ("Comment", {
    comment_content: String,
    userId: {type: Schema.Types.ObjectId, ref: 'comment'}
});

module.exports = Comment

