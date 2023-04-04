var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);

var Product = models.Product;

router.get('/', async function (req, res, next) {
    var products = await Product.findAll()
    var response = { products: products };
    res.render('products/index', response);
});

router.get('/create', async function (req, res, next) {
    res.render('products/create');
});

router.post('/create', async function (req, res, next) {
    var name = req.body.name;
    var expirationPeriod = req.body.expirationPeriod;
    var description = req.body.description;
    var price = req.body.price;
    var product = await Product.create({
        name: name,
        description: description,
        price: price,
        expirationPeriod: expirationPeriod
    });
    res.redirect('/products/' + product.id);

});

router.get('/:id', async function (req, res, next) {
    var product = await Product.findByPk(req.params.id);
    if (!product) {
        res.send('404 not found');
    }
    res.render('products/edit', {
        product: product
    });
});

router.post('/:id', async function (req, res, next) {
    var product = await Product.findByPk(req.params.id);
    if (!product) {
        res.send('404 not found');
    }
    product.set({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        expirationPeriod: req.body.expirationPeriod
    });
    await product.save();
    res.render('products/edit', {
        product: product,
        successMessage: 'Product updated successfuly'
    });
});

router.get('/delete/:id', async function (req, res, next) {
    var product = await Product.findByPk(req.params.id);
    if (!product) {
        res.send('404 not found');
    }
    await product.destroy();
    var successMessage = encodeURIComponent('product successfully deleted');
    res.redirect('/product?successMessage=' + successMessage);
});


module.exports = router;
