
var models = require('../models');

var Inventory = models.Inventory;

async function showInventoriesListPage (req, res, next) {
    var inventories = await Inventory.findAll({
        include: models.InventoryRecord
    });
    var response = {
        inventories: inventories
    };
    if(req.query.successMessage) {
        response.successMessage = req.query.successMessage;
    }
    res.render('inventories/index', response);
}


async function showCreateInventoryPage(req, res, next) {
    res.render('inventories/create');
}

async function  createInventory(req, res, next) {
    var name = req.body.name;
    var capacity = req.body.capacity;
    var description = req.body.description;
    var inventory = await Inventory.create({
        name: name,
        description: description,
        capacity: capacity
    });
    res.redirect('/inventories/' + inventory.id);
}

async function showInventoryPage (req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        res.send('404 not found');
    }
    res.render('inventories/edit', {
        inventory: inventory
    });
}

async function editInventory (req, res, next) {
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
}

async function deleteInventory (req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        res.send('404 not found');
    }
    await inventory.destroy();
    var successMessage = encodeURIComponent('Inventory successfully deleted');
    res.redirect('/inventories?successMessage=' + successMessage);
}

module.exports = {
    showInventoriesListPage: showInventoriesListPage,
    showCreateInventoryPage: showCreateInventoryPage,
    createInventory: createInventory,
    showInventoryPage: showInventoryPage,
    editInventory: editInventory,
    deleteInventory: deleteInventory
}
