var express = require('express');
var router = express.Router();
const client = require('../controllers/client');
const validators = require('../validators/validators');

router.post('/login',client.loginClient);
router.get('/logout',validators.isLoggedIn,client.clientLogout);

router.get('/refresh',validators.refreshToken);

router.post('/addPermission',validators.isLoggedIn , validators.permissable , client.addPermission);
router.get('/permissions', validators.isLoggedIn, validators.permissable ,client.getPermissions);





module.exports = router;