var express = require('express');
var router = express.Router();
const client = require('../controllers/client');
const validators = require('../validators/validators');


// Login and logout routes for client
router.post('/login',client.loginClient);
router.get('/logout',validators.isLoggedIn,client.clientLogout);

// user refresh token to get new access token if access token is expired
router.get('/refresh',validators.refreshToken);

// add permission route for one user to add a route for another user  -- check for client login & this service is permissible
router.post('/addPermission',validators.isLoggedIn , validators.permissable , client.addPermission);
// permissions route for users to know their permissions  -- check for client login & this service is permissible
router.get('/permissions', validators.isLoggedIn, validators.permissable ,client.getPermissions);





module.exports = router;