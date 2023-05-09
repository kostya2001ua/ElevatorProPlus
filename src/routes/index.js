var authRoutes = require('./auth');
var homeRoutes = require('./home');
var inventoriesRoutes = require('./inventories');
var productsRoutes = require('./products');
var inventoryRecordsRoutes = require('./inventoryRecords');
var usersRoutes = require('./users');
var profileRoutes = require('./profile');


//set up routes
module.exports = function(app) {
    app.use('/', homeRoutes);
    app.use('/users', usersRoutes);
    app.use('/profile', profileRoutes);
    app.use('/auth', authRoutes);
    app.use('/inventories', inventoriesRoutes);
    app.use('/products', productsRoutes);
    app.use('/inventory-records', inventoryRecordsRoutes);
}
