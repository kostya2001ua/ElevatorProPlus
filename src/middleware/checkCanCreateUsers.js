
module.exports = function (req, res, next) {
    if (req.session.user && req.session.user.can_create_users) {
        next();
    } else {
        res.redirect('/auth/signin');
    }
}