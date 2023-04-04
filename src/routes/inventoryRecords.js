var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');
const { all } = require('./auth');

router.use(checkAuth);

var InventoryRecord = models.InventoryRecord;
var Inventory = models.Inventory;
var Product = models.Product;

router.get('/', async function (req, res, next) {
    // var inventoryRecords = await InventoryRecord.findAll()
    var inventoryId = req.query.inventoryId;
    var inventory = await Inventory.findByPk(inventoryId, {
        include: InventoryRecord
    });
    if (!inventory) {
        return next();
    }
    var inventoryRecords = await inventory.getInventoryRecords({
        include: Product
    });
    var response = {
        inventory: inventory,
        inventoryRecords: inventoryRecords
    };
    res.render('inventoryRecords/index', response);
});

router.get('/create', async function (req, res, next) {
    var inventoryId = req.query.inventoryId;
    var inventory = await Inventory.findByPk(inventoryId, {
        include: InventoryRecord
    });
    if (!inventory) {
        return next();
    }

    var products = await Product.findAll();

    var response = {
        inventory: inventory,
        products: products
    };
    res.render('inventoryRecords/create', response);
});

router.post('/create', async function (req, res, next) {
    var inventoryId = req.query.inventoryId;
    var inventory = await Inventory.findByPk(inventoryId, {
        include: InventoryRecord
    });
    var productId = req.body.productId;
    var allocation = req.body.allocation;
    var products = await Product.findAll();
    var response = {
        inventory: inventory,
        products: products
    };
    if (Number(allocation) + inventory.totalAllocation > inventory.capacity) {
        response.allocation = allocation;
        response.productId = productId;
        response.errorMessage = 'Can not create inventory record: will exceed inventory capacity';
    } else {
        var inventoryRecord = await InventoryRecord.create({
            inventoryId: inventoryId,
            productId: productId,
            allocation: allocation
        });
        response.inventory = await inventory.reload({
            include: InventoryRecord
        });
        response.successMessage = 'Inventory record created successfully!';
    }
    return res.render('inventoryRecords/create', response);
});

router.get('/edit', async function(req, res, next) {

});

module.exports = router;
