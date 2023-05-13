var express = require('express');

var router = express.Router();

var ordersController = require('../controllers/ordersController');
const { or } = require('sequelize');


router.get('/', ordersController.showOrdersListPage);

router.get('/create', ordersController.showCreateOrderPage);
router.post('/create', ordersController.createOrder);

router.post('/add-product', ordersController.addLineItem);
router.post('/delete-product', ordersController.removeLineItem);

router.post('/change-status', ordersController.updateStatus);

router.get('/:id', ordersController.showOrderPage);


module.exports = router;
