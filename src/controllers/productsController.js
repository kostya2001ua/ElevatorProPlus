var models = require('../models');
var Product = models.Product;

async function showProductsPage(req, res, next) {
    var products = await Product.findAll()
    var response = { products: products };
    res.render('products/index', response);
}

async function showCreateProductPage(req, res, next) {
    res.render('products/create');
}

async function createProduct(req, res, next) {
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

}

async function showProductPage(req, res, next) {
    var product = await Product.findByPk(req.params.id);
    if (!product) {
        res.send('404 not found');
    }
    res.render('products/edit', {
        product: product
    });
}

async function editProduct(req, res, next) {
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
}

async function deleteProduct(req, res, next) {
    var product = await Product.findByPk(req.params.id);
    if (!product) {
        res.send('404 not found');
    }
    await product.destroy();
    var successMessage = encodeURIComponent('product successfully deleted');
    res.redirect('/product?successMessage=' + successMessage);
}

module.exports = {
    showProductsPage: showProductsPage,
    showCreateProductPage: showCreateProductPage,
    createProduct: createProduct,
    showProductPage: showProductPage,
    editProduct: editProduct,
    deleteProduct: deleteProduct
}