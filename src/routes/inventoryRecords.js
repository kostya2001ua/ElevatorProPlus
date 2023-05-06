var express = require('express');
var router = express.Router();

var inventoryRecordsController = require('../controllers/inventoryRecordsController');

var checkAuth = require('../middleware/checkAuth');
router.use(checkAuth);

router.get('/', inventoryRecordsController.showInventoryRecordsListPage);

router.get('/create', inventoryRecordsController.showCreateInventoryRecordsPage);

router.get('/move', inventoryRecordsController.showMoveInventoryRecordPage);

router.post('/create', inventoryRecordsController.createInventoryRecord);

router.post('/move', inventoryRecordsController.moveInventoryRecord);

module.exports = router;
