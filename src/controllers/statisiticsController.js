var models = require('../models');

async function showStatisticsPage(req, res, next) {
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
    res.render('statistics/index', {
        financeReport: {
            labels: Object.keys(orderIncomeStat),
            data: Object.values(orderIncomeStat)
        }
    })
}


module.exports = {
    showStatisticsPage: showStatisticsPage
}
