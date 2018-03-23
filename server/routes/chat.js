var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/authentication');
var ChatController = require('../controllers/chat');
var passportService = require('../config/passport');
var passport = require('passport');


const requireToken = passportService.authenticateJWT;
const requireCredentials = passportService.authenticateCredentials;

router.post('/getMessages', requireToken, ChatController.getMessages);


module.exports = router;