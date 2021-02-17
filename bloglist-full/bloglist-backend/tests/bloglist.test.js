const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'beer', name: 'admin', passwordHash });
    await user.save();
});

describe('when bloglist has some content', () => {

    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('get returns all the blogs in database', async () => {
        const blogs = await api.get('/api/blogs');
        expect(blogs.body).toHaveLength(helper.initialBlogs.length);
    });

    test('there is blog about react patterns', async () => {
        const blogs = await helper.blogsInDb();
        const blogTitles = blogs.map(blog => blog.title);
        expect(blogTitles).toContain('React patterns')
    });

    test('identifier id is used on returned blogs', async () => {
        const blogs = await helper.blogsInDb();
        expect(blogs[0].id).toBeDefined();
    });

    test('GET with existing id succeeds', async () => {
        const blogs = await helper.blogsInDb();
        const idToFind = blogs[0].id;

        await api
            .get(`/api/blogs/${idToFind}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('GET with valid nonexisting id fails with code 404', async () => {
        const nonexistingId = await helper.nonExistingId();
        await api
            .get(`/api/blogs/${nonexistingId}`)
            .expect(404);
    });

    test('GET with invalid id fails with code 400', async () => {
        const invalidId = 'aabbccddee';
        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400);
    });

    test('deleting a blog succeeds with code 204', async () => {
        const blogs = await helper.blogsInDb();
        const blogToDelete = blogs[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

        const blogsAfterDelete = await helper.blogsInDb();
        const blogContent = blogsAfterDelete.map(blog => blog.title);
        expect(blogsAfterDelete.length).toBe(helper.initialBlogs.length - 1);
        expect(blogContent).not.toContain(blogToDelete.title);

    });

    test('updating number of likes in existing blog increases nuber of likes', async () => {
        const blogs = await helper.blogsInDb();
        const blogToUpdate = blogs[0];

        const updatedBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
        expect(updatedAtEnd.likes).toBe(blogToUpdate.likes + 1);
    });

});

describe('addition of a new blog', () => {

    test('succeeds with a valid data', async () => {
        const userList = await helper.usersInDB();
        const newBlog = {
            title: 'New Test Blog',
            author: 'New Test Blogger',
            url: 'http://testurl.tst',
            likes: 95,
            userId: userList[0].id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAfterPosting = await helper.blogsInDb();
        expect(blogsAfterPosting.length).toBe(helper.initialBlogs.length + 1);

        const blogTitles = blogsAfterPosting.map(blog => blog.title);
        expect(blogTitles).toContain('New Test Blog');
    });

    test('blog with no likes gets value likes: 0', async () => {
        const userList = await helper.usersInDB();
        const unlikedBlog = {
            title: 'Unliked Blog',
            author: 'Unliked Author',
            url: 'http://noonelikes.com',
            userId: userList[0].id
        }

        await api
            .post('/api/blogs')
            .send(unlikedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAfterPosting = await helper.blogsInDb();
        const newBlog = blogsAfterPosting.find(blog => blog.title === unlikedBlog.title);
        expect(newBlog.likes).toBe(0);

    });

    test('blog with no title results error 400', async () => {
        const userList = await helper.usersInDB();
        const untitledBlog = {
            author: 'Lazy Titlegiver',
            url: 'http;//atleastthisoneexist.com',
            likes: 11,
            userId: userList[0].id
        }
        await api
            .post('/api/blogs')
            .send(untitledBlog)
            .expect(400)
    });

    test('blog with no title results error 400', async () => {
        const userList = await helper.usersInDB();
        const unurledBlog = {
            title: 'Where the theck is this blog??',
            author: 'U.N Urler',
            likes: 11,
            userId: userList[0].id
        }
        await api
            .post('/api/blogs')
            .send(unurledBlog)
            .expect(400)
    });

});

afterAll(() => {
    mongoose.connection.close();
})