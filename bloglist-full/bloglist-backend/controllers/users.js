const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

/*
* Palautetaan kaikkien käyttäjien tiedot
*/
usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, author: 1, url: 1 });
    res.json(users.map(user => user.toJSON()));
});

usersRouter.get('/:id', async (req, res) => {
    const user = await User
        .findById(req.params.id)
        .populate('blogs', { title: 1, author: 1, url: 1 });

    if (user) {
        res.json(user.toJSON());
    } else {
        res.status(404).end();
    }
});

/*
* Lisätään uusi käyttäjä tietokantaan.
*/

usersRouter.post('/', async (req, res) => {
    const { password, name, username } = req.body;

    if (!password || password.length < 3) {
        return res
            .status(400)
            .send({ error: 'password must be at least 3 characters long' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username: username,
        name: name,
        passwordHash
    });

    const savedUser = await user.save();

    res.json(savedUser);
});

module.exports = usersRouter;