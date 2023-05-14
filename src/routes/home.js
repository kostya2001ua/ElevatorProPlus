var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');


/* GET home page. */
router.get('/', checkAuth, async function (req, res, next) {
    var inventoryRecords = await models.InventoryRecord.findAll({
        include: [models.Product, models.Inventory]
    });

    inventoryRecords = inventoryRecords.filter(inventoryRecord => {
        var expiresAt = inventoryRecord.expiresAtDate;
        var currentDate = new Date();
        var diffTime = Math.abs(expiresAt - currentDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30 && diffDays > 0;
    });

    res.render('home', {
        expiringRecords: inventoryRecords
    });
});

module.exports = router;
