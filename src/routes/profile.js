var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/checkAuth');

router.use(checkAuth);
var profileController = require('../controllers/profileController');

router.get('/', profileController.showProfilePage);


module.exports = router;
