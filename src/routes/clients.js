var express = require('express');
var router = express.Router();

var clientsController = require('../controllers/clientsController');
router.get('/', clientsController.showClientsListPage)
router.get('/new', clientsController.showCreateClientPage);
router.post('/new', clientsController.createClient);
router.post('/edit', clientsController.editClient);

router.get('/:id', clientsController.showClientPage);

module.exports = router;
