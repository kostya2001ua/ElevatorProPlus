
module.exports = function (req, res, next) {
    return next();
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/signin');
    }
}