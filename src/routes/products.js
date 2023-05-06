var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);


var productsController = require('../controllers/productsController');

router.get('/', productsController.showProductsPage);

router.get('/create', productsController.showCreateProductPage);

router.post('/create', productsController.createProduct);

router.get('/:id', productsController.showProductPage);

router.post('/:id', productsController.editProduct);

router.get('/delete/:id', productsController.deleteProduct);

router.get('/inventory-records/:id', productsController.showProductInventoryRecords);

module.exports = router;
