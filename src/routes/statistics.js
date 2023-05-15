var express = require('express');
var router = express.Router();

var statisticsController = require('../controllers/statisiticsController');

var checkAuth = require('../middleware/checkAuth');
router.use(checkAuth);

router.get('/', statisticsController.showStatisticsPage);

module.exports = router;
