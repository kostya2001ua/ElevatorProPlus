var express = require('express');
var router = express.Router();

var models = require('../models');
var checkAuth = require('../middleware/checkAuth');

/* GET home page. */
router.get('/', checkAuth, async function (req, res, next) {
    res.send('test')
});

module.exports = router;
