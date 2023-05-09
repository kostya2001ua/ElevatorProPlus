var express = require('express');
var router = express.Router();

var checkCanCreateUsers = require('../middleware/checkCanCreateUsers');


var usersController = require('../controllers/usersController');

router.post('/changePassword', usersController.changePassword);

router.use(checkCanCreateUsers);
router.get('/', usersController.showUsersListPage);
router.get('/:id', usersController.showUserPage);
router.post('/:id', usersController.editUser);



module.exports = router;
