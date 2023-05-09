async function showProfilePage(req, res, next) {
    if(!req.session.user) {
        return res.redirect('/auth/signin')
    }
    res.render('profile/index', {
        user: req.session.user
    });
}

module.exports = {
    showProfilePage: showProfilePage
}
