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
        var email = req.body.email;
        var password = req.body.password;
        var user = await User.findOne({ where: { email: email } });

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

// router.get('/signup', async function (req, res, next) {
//     var salt = await bcrypt.genSalt(10);
//     var user = {
//         first_name: 'Kostiantyn',
//         last_name: 'Liakhov',
//         email: 'kostiantyn.liakhov@gmail.com',
//         password: await bcrypt.hash('Test1234!', salt)
//     };
//     created_user = await User.create(user);
//     res.status(201).json(created_user);
// });


module.exports = router;
