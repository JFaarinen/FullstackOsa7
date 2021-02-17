const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    author: {
        type: String,
        required: true,
        minlength: 5
    },
    url: {
        type: String,
        required: true,
        minlength: 8
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
});

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Blog', blogSchema);