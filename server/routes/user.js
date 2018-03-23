var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/authentication');
var UserController = require('../controllers/user')
var passportService = require('../config/passport');
var passport = require('passport');

const requireToken = passportService.authenticateJWT;
const requireCredentials = passportService.authenticateCredentials;


router.post('/signup', AuthController.register);
router.post('/signin', requireCredentials, AuthController.login);
router.post('/signout', requireToken, AuthController.logout);


router.get('/getOnlineUsers', requireToken, UserController.getOnlineUsers);
router.post('/getUser', requireToken, UserController.getUser);
router.post('/setUserProfile', requireToken, UserController.setUserProfile);
router.post('/changeUserPassword', requireToken, UserController.changeUserPassword);

router.post('/protected', requireToken, function(req, res, next) {
    res.send({ content: 'Success' });
});

module.exports = router;