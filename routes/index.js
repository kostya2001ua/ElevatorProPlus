var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');

var authRoutes = require('./auth');

/* GET home page. */
router.get('/', async function (req, res, next) {
    try {
         
        var inventory = await models.Inventory.create({
            name: 'Main Inventory',
            description: 'main inventory of elevator',
            capacity: 10000
        });
        var product = await models.Product.create({
            name: 'Rice',
            description: 'some rice',
            price: 100,
            expirationPeriod: 1000
        });

        await models.InventoryRecord.create({
            allocation: 100,
            inventoryId: inventory.id,
            productId: product.id
        });
    } catch(e) {
        console.log(e.message)
    }
    res.send('test')
});

module.exports = router;
