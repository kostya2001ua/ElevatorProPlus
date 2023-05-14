var models = require('../models');

async function showStatisticsPage(req, res, next) {
    res.render('statistics/index', {
        financeReport: await getFinanceReport(),
        productsReport: await productsReport(),
        clientsReport: await getClientsStats()
    });
}

async function productsReport() {
    var products = await models.Product.findAll({
        include: models.InventoryRecord
    });
    var labels = [];
    var data = [];
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        var inventoryRecords = product.InventoryRecords;
        var totalAllocation = inventoryRecords.reduce((acc, inventoryRecord) => {
            return acc + inventoryRecord.allocation
        }, 0);
        data.push(totalAllocation);
        labels.push(product.name);
    }
    return {
        labels: labels,
        data: data
    }
}

async function getFinanceReport() {
    var orders = await models.Order.findAll({
        include: [{ model: models.LineItem, include: [models.Product] }],
        where: {
            status: 'fulfilled',
        }
    });
    var orderIncomeStat = {};
    orders.forEach(order => {
        var date = new Date(order.updatedAt).toLocaleString('uk-UA',  {
            year: "numeric",
            month: "2-digit",
            day: "numeric"
        })
        if(!(date in orderIncomeStat)) {

            orderIncomeStat[date] = order.totalPrice;
        } else {
            orderIncomeStat[date] += order.totalPrice;
        }
    });
    return {
        labels: Object.keys(orderIncomeStat),
        data: Object.values(orderIncomeStat)
    }
}

async function getClientsStats() {
    var clients = await models.Client.findAll({
        include: {
            model: models.Order,
            include: {
                model: models.LineItem,
                include: models.Product
            }
        }
    });
    var labels = [];
    var data = [];
    clients.forEach(client => {
        labels.push(client.company_name);
        var totalAmount = client.Orders.reduce((acc,order) => {
            return acc + order.totalPrice
        }, 0);
        data.push(totalAmount);
    });
    return {
        labels: labels,
        data: data
    }
}

module.exports = {
    showStatisticsPage: showStatisticsPage
}
