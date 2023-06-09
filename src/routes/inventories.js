var express = require('express');
var router = express.Router();

var checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);

var inventoryController = require('../controllers/inventoryController');

router.get('/', checkAuth, inventoryController.showInventoriesListPage);

router.get('/create', inventoryController.showCreateInventoryPage);

router.post('/create', inventoryController.createInventory);

router.get('/:id', inventoryController.showInventoryPage);

router.post('/:id', inventoryController.editInventory);

router.get('/delete/:id', inventoryController.deleteInventory);

module.exports = router;
