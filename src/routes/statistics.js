var express = require('express');
var router = express.Router();

var statisticsController = require('../controllers/statisiticsController');

router.get('/', statisticsController.showStatisticsPage);

module.exports = router;
