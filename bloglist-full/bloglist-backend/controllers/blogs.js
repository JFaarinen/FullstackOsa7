const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
//const user = require('../models/user');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 });
    res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 });
    if (blog) {
        res.json(blog.toJSON());
    } else {
        res.status(404).end();
    }
});

blogsRouter.post('/', async (req, res) => {
    const body = req.body;
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user._id
    });

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    const returnBlog = await Blog.findById(savedBlog._id)
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 });

    res.status(201).json(returnBlog);
});

blogsRouter.post('/:id/comments', async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log(body, '  ', id);
    const commentedBlog = await Blog.findById(id);

    const newComment = new Comment({
        comment: body.comment,
        blog: commentedBlog._id
    });
    const savedComment = await newComment.save();
    commentedBlog.comments = commentedBlog.comments.concat(savedComment._id);
    await commentedBlog.save();
    res.status(201).json(savedComment);
});

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    res.json(updatedBlog.toJSON());
});

blogsRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(req.params.id);

    if (blog.user.toString() !== user.id.toString()) {
        return res.status(401).json({ error: 'only the creator can remove the blog' });
    }

    await blog.remove();
    user.blogs = user.blogs.filter(b => b.id.toString !== req.params.id.toString());
    await user.save();

    res.status(204).end();
});

module.exports = blogsRouter;