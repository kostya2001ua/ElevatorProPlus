var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);

var Inventory = models.Inventory;

router.get('/', async function (req, res, next) {
    var inventories = await Inventory.findAll();
    var response = {
        inventories: inventories
    };
    if(req.query.successMessage) {
        response.successMessage = req.query.successMessage;
    }
    res.render('inventories/index', response);
});


router.get('/create', async function (req, res, next) {
    res.render('inventories/create');
});

router.post('/create', async function (req, res, next) {
    var name = req.body.name;
    var capacity = req.body.capacity;
    var description = req.body.description;
    var inventory = await Inventory.create({
        name: name,
        description: description,
        capacity: capacity
    });
    res.redirect('/inventories/' + inventory.id);
});

router.get('/:id', async function (req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        res.send('404 not found');
    }
    res.render('inventories/edit', {
        inventory: inventory
    });
});

router.post('/:id', async function (req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        res.send('404 not found');
    }
    inventory.set({
        name: req.body.name,
        description: req.body.description,
        capacity: req.body.capacity
    });
    await inventory.save();
    res.render('inventories/edit', {
        successMessage: 'Inventory successfully updated',
        inventory: inventory
    });
});

router.get('/delete/:id', async function (req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        res.send('404 not found');
    }
    await inventory.destroy();
    var successMessage = encodeURIComponent('Inventory successfully deleted');
    res.redirect('/inventories?successMessage=' + successMessage);
});

module.exports = router;
