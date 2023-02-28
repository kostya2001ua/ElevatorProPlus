var authRoutes = require('./auth');
var homeRoutes = require('./home');

//set up routes
module.exports = function(app) {
    app.use('/', homeRoutes);
    app.use('/auth', authRoutes);
}
