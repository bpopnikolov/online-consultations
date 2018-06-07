var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/authentication');
var ChatController = require('../controllers/chat');
var passportService = require('../config/passport');
var passport = require('passport');
var User = require('../models/user');


const requireToken = passportService.authenticateJWT;
const requireCredentials = passportService.authenticateCredentials;

router.post('/getMessages', requireToken, ChatController.getMessages);
router.get('/getUserName/:id', requireToken, async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (user) {
        return res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
        });
    }
    return res.status(404).json({
        error: true,
        msg: 'user not found!',
    });
});


module.exports = router;
