var models = require('../models');

async function showUsersListPage(req, res, next) {
    var users = await models.User.findAll();
    res.render('users/list', {
        users: users
    });
}

async function showUserPage(req, res, next) {
    var user = await models.User.findByPk(req.params.id);
    if(!user) {
        return next();
    }
    res.render('users/user', {
        user: user
    });
}

async function editUser(req, res, next) {
    try {
        var user = await models.User.findByPk(req.params.id);
        if(!user) {
            throw new Error('User not found!');
        }

        user.set({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            can_create_users: ('can_create_users' in req.body && req.body.can_create_users == 'on')
        });
        await user.save();

        res.json({
            success: true,
            message: 'User data updates successfully'
        });
    } catch(err) {

        res.json({
            success: false,
            message: err.message
        });
    }
}

async function changePassword(req, res, next) {
    try {
        var user = await models.User.findByPk(req.body.userID);
        if(!user) {
            throw new Error('User not found');
        }
        // if (!req.session.user || user.id !== req.session.user.id || !req.session.user.can_create_users) {
        //     throw new Error('You lack permissions to do that!');
        // }
        var password = req.body.password;
        var passwordConfirm = req.body.password_confirm;
        if(password !== passwordConfirm) {
            throw new Error('Passwords do not match');
        }

        var bcrypt = require('bcrypt');
        var salt = await bcrypt.genSalt(10);
        user.set({
            password: await bcrypt.hash(password, salt)
        })
        await user.save();
        res.json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch(err) {
        res.json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    showUsersListPage: showUsersListPage,
    showUserPage: showUserPage,
    editUser: editUser,
    changePassword: changePassword
}
