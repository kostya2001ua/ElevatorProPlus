var models = require('../models');

var InventoryRecord = models.InventoryRecord;
var Inventory = models.Inventory;
var Product = models.Product;

async function showInventoryRecordsListPage(req, res, next) {
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
}

async function showCreateInventoryRecordsPage(req, res, next) {
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
}

async function createInventoryRecord(req, res, next) {
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
        await InventoryRecord.create({
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
}

async function showMoveInventoryRecordPage(req, res, next) {
    var inventoryRecordId = req.query.inventoryRecordId;
    var inventoryRecord = await InventoryRecord.findByPk(inventoryRecordId, {
        include: [
            { model: models.Inventory, include: [InventoryRecord] },
            {model: models.Product}
        ]
    });
    if (!inventoryRecord) {
        return next();
    }

    var inventories = await Inventory.findAll({
        include: InventoryRecord
    });
    return res.render('inventoryRecords/move', { inventoryRecord: inventoryRecord, inventories: inventories });
}

async function moveInventoryRecord(req, res, next) {
    var moveToInventoryId = req.body.moveToInventoryId;
    var inventory = await Inventory.findByPk(moveToInventoryId, {
        include: InventoryRecord
    });
    var inventoryRecord = await InventoryRecord.findByPk(req.body.inventoryRecordId, {
        include: models.Product
    });
    if(!inventory || !inventoryRecord || !inventory.canFit(inventoryRecord.allocation)) {
        return next();
    }
    inventoryRecord.inventoryId = inventory.id;
    await inventoryRecord.save();
    inventory = await inventory.reload({
        include: InventoryRecord
    });
    return res.render('inventoryRecords/moveSuccess', { inventoryRecord: inventoryRecord, inventory: inventory });

}

async function deleteInventoryRecord(req, res, next) {
    var inventoryRecord = await InventoryRecord.findByPk(req.query.inventoryRecordId, {
        include: {
            model:models.Inventory,
            include: models.InventoryRecord
        }
    });
    if(!inventoryRecord) {
        return next();
    }
    await inventoryRecord.destroy();
    return res.json({
        success: true,
        newAllocationString: inventoryRecord.Inventory.allocationString
    });
}

module.exports = {
    showInventoryRecordsListPage: showInventoryRecordsListPage,
    showCreateInventoryRecordsPage: showCreateInventoryRecordsPage,
    createInventoryRecord: createInventoryRecord,
    showMoveInventoryRecordPage: showMoveInventoryRecordPage,
    moveInventoryRecord: moveInventoryRecord,
    deleteInventoryRecord: deleteInventoryRecord
}
