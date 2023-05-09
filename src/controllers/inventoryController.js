
var models = require('../models');

var Inventory = models.Inventory;

async function showInventoriesListPage(req, res, next) {
    var inventories = await Inventory.findAll({
        include: models.InventoryRecord
    });
    var response = {
        inventories: inventories
    };
    if (req.query.successMessage) {
        response.successMessage = req.query.successMessage;
    }
    res.render('inventories/index', response);
}


async function showCreateInventoryPage(req, res, next) {
    res.render('inventories/create');
}

async function createInventory(req, res, next) {
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

async function showInventoryPage(req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        return next();
    }
    res.render('inventories/edit', {
        inventory: inventory
    });
}

async function editInventory(req, res, next) {
    try {
        var inventory = await Inventory.findByPk(req.params.id, {
            include: models.InventoryRecord
        });
        if (!inventory) {
            throw new Error('Inventory not found!');
        }
        if(inventory.totalAllocation > req.body.capacity) {
            throw new Error('Can not update: total allocation will exceed capacity')
        }
        inventory.set({
            name: req.body.name,
            description: req.body.description,
            capacity: req.body.capacity
        });
        await inventory.save();
        res.json({
            success: true,
            message: 'Inventory successfully updated'
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
}

async function deleteInventory(req, res, next) {
    var inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
        return next()
    }
    await inventory.destroy();
    res.render('deleteSuccess', {
        message: 'Inventory successfully deleted',
        backTo: 'Inventories',
        backToLink: '/inventories'
    });
}

module.exports = {
    showInventoriesListPage: showInventoriesListPage,
    showCreateInventoryPage: showCreateInventoryPage,
    createInventory: createInventory,
    showInventoryPage: showInventoryPage,
    editInventory: editInventory,
    deleteInventory: deleteInventory
}
