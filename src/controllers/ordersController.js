var models = require('../models');
var sequelize = require('sequelize');

async function showCreateOrderPage(req, res, next) {
    var clients = await models.Client.findAll();
    var products = await models.Product.findAll();
    res.render('orders/create', {
        clients: clients,
        products: products
    });
}

async function createOrder(req, res, next) {
    var client = await models.Client.findByPk(req.body.clientId);
    var product = await models.Product.findByPk(req.body.productId);
    if (!client || !product) {
        return next();
    }
    var order = await models.Order.create({
        clientId: client.id,
        userId: 1,
        description: req.body.description,
        status: 'created'
    });
    var lineItem = new models.LineItem({
        productId: product.id,
        orderId: order.id,
        quantity: parseFloat(req.body.quantity)
    });

    await lineItem.save();
    res.redirect('/orders/' + order.id);
}

async function showOrderPage(req, res, next) {
    var orderId = req.params.id;
    var order = await models.Order.findByPk(orderId, {
        include: [{ model: models.LineItem, include: [models.Product] }, models.Client, models.User]
    });
    var products = await models.Product.findAll();
    if(!order) {
        return next();
    }
    res.render('orders/order', {
        order: order,
        products: products
    });
}

async function addLineItem(req, res, next) {
    try {
        var order = await models.Order.findByPk(req.query.orderId);
        var product = await models.Product.findByPk(req.body.productId);
        if(!order) {
            throw new Error('Order Not Found');
        }
        if(!product) {
            throw new Error('Product Not Found');
        }
        var lineItem = new models.LineItem({
            productId: product.id,
            orderId: order.id,
            quantity: parseFloat(req.body.quantity)
        });
    
        await lineItem.save();
        res.json({
            success: true
        });
    } catch(err) {
        res.json({
            success: false,
            message: err.message
        });
    }
}

async function removeLineItem(req, res, next) {
    try {
        var lineItem = await models.LineItem.findByPk(req.query.lineItemId);
        if(!lineItem) {
            throw new Error('Line Item Not Found');
        }
        await lineItem.destroy();
        res.json({
            success: true
        });
    } catch(err) {
        res.json({
            success: false,
            message: err.message
        });  
    }
}

async function showOrdersListPage(req, res, next) {
    var orders;
    if(req.query.orderStatus) {
        orders = await models.Order.findAll({
            where: {
                status: req.query.orderStatus
            },
            include: [{ model: models.LineItem, include: [models.Product] }, models.Client, models.User]
        });
    } else {
        orders = await models.Order.findAll({
            include: [{ model: models.LineItem, include: [models.Product] }, models.Client, models.User]
        });
    }
    res.render('orders/list', {
        orders: orders
    });
}

async function updateStatus(req, res, next) {
    try {
        var orderId= req.query.orderId;
        var status = req.body.status;
        var order = await models.Order.findByPk(orderId, {
            include: [{ model: models.LineItem, include: [models.Product] }]
        });
        if(status == 'fulfilled') {
            var error = await fullfillOrder(order);
            if(error) {
                throw new Error(error);
            }
        }
        if(!order) {
            throw new Error('Order Not Found');
        }
        order.status = status;
        order.save();
        res.json({
            success: true
        });
    } catch(err) {
        res.json({
            success: false,
            message: err.message
        });  
    }
}

async function fullfillOrder(order) {
    var error = false;
    for (let index = 0; index < order.LineItems.length; index++) {
        if(error) break;
        const lineItem = order.LineItems[index];
        var product = lineItem.Product;
        var inventoryRecords = await models.InventoryRecord.findAll({
            include: models.Product,
            where: {
                productId: product.id
            }
        });
        inventoryRecords = inventoryRecords.sort(function (a, b) {
            if (a.expiresAtDate > b.expiresAtDate) return 1;
            if (a.expiresAtDate < b.expiresAtDate) return -1;
            return 0;
        });
        var totalAllocation = inventoryRecords.reduce(function (accum, ir) {
            return accum + ir.allocation;
        }, 0);
        if (totalAllocation < lineItem.quantity) {
            error = 'Not enough ' + product.name + ' in inventory';
            break;
        }
        var remainingQty = lineItem.quantity;
        for (var i = 0; i < inventoryRecords.length; i++) {
            var inventoryRecord = inventoryRecords[i];
            if (inventoryRecord.allocation <= remainingQty) {
                await inventoryRecord.destroy();
                remainingQty = remainingQty - inventoryRecord.allocation;
            } else {
                inventoryRecord.allocation = inventoryRecord.allocation - remainingQty;
                remainingQty = 0;
                await inventoryRecord.save();
            }
        }
    }
    return error;
}

module.exports = {
    showCreateOrderPage: showCreateOrderPage,
    createOrder: createOrder,
    showOrderPage: showOrderPage,
    addLineItem: addLineItem,
    removeLineItem: removeLineItem,
    showOrdersListPage: showOrdersListPage,
    updateStatus: updateStatus
}
