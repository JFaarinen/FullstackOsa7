const Blog = require('../models/blog');
const User = require('../models/user');
const initialBlogs = require('./blogs');

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'nonExistingBlog',
        author: 'Nonexisting author',
        url: 'https://doesntreallymatter.no',
        likes: 0
    });
    await blog.save();
    await blog.remove();
    return blog._id.toString();
}

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

const usersInDB = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDB
}