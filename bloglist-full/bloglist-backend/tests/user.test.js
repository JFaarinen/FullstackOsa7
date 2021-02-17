const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const User = require('../models/user');

describe('users test', () => {
    describe('when there are initially one user at db', () => {
        beforeEach(async () => {
            await User.deleteMany({});
            const passwordHash = await bcrypt.hash('sekret', 10);
            const user = new User({ username: 'root', name: 'admin', passwordHash });
            await user.save();
        });

        test('creation succeeds with a fresh username', async () => {
            const usersAtStart = await helper.usersInDB();

            const newUser = {
                username: 'gbrush',
                name: 'Guybrush Treepwood',
                password: 'monkey'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-type', /application\/json/);

            const usersAtEnd = await helper.usersInDB();
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

            const usernames = usersAtEnd.map(user => user.username);
            expect(usernames).toContain(newUser.username);
        });

        test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDB();

            const newUser = {
                username: 'root',
                name: 'SuperUser',
                password: 'palainen'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(result.body.error).toContain('expected `username` to be unique');

            const usersAtEnd = await helper.usersInDB();
            expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });

        test('creation fails with statuscode 400 and error message if password is under 2 characters', async () => {
            const usersAtStart = await helper.usersInDB();

            const newUser1 = {
                username: 'user1',
                name: 'User Yksi'
            }

            const u1Result = await api
                .post('/api/users')
                .send(newUser1)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(u1Result.body.error).toContain('password must be at least 3 characters long');
            const usersAtEnd = await helper.usersInDB();
            expect(usersAtEnd).toHaveLength(usersAtStart.length);

        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});