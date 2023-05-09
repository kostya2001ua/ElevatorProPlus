var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var models = require('../models');

var User = models.User;

router.get('/signin', async function (req, res, next) {
    res.render('auth/signin');
});

router.post('/signin', async function (req, res, next) {
    try {
        req.session.user = null;

        var username = req.body.username;
        var password = req.body.password;
        var user = await User.findOne({ where: { username: username } });

        if (!user) {
            throw new Error('User does not exist');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error('Incorrect Password');
        }
        req.session.user = user;
        res.redirect('/');
    } catch (e) {
        
        res.render('auth/signin', {
            error: e.message
        });
    }
});

router.get('/logout', async function(req, res, next) {
    req.session.user = null;
    res.redirect('/auth/signin');
});

module.exports = router;
