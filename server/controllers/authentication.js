var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../config/auth');

function generateToken(user) {
    return jwt.sign({
        user: user
    }, authConfig.secret, {
        // expiresIn: '0'
    });
}

function setUserInfo(request) {
    return {
        firstname: request.firstname,
        lastname: request.lastname,
        _id: request._id,
        email: request.email,
        role: request.role,
        profileInfo: request.profileInfo,
        status: request.status
    };
}

exports.login = (req, res, next) => {
    const userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: {
            firstname: userInfo.firstname,
            _id: userInfo._id,
            role: userInfo.role,
            status: userInfo.status
        }
    });
}

exports.logout = function(req, res, next) {
    console.log(req.user.email);


    User.findOneAndUpdate({
        email: req.user.email
    }, {
        $set: {
            status: 'offline'
        }
    }, {
        new: true
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        console.log(user);
        res.status(201).json({
            message: user.firstname + ' Successfully signed out!',
            status: user.status
        });
    });

}

exports.register = function(req, res, next) {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const profile = {
        phone: "",
        facultyNumber: "",
        consultationsTime: ""
    };

    if (!email) {
        return res.status(422).send({
            error: true,
            msg: 'You must enter an email address'
        });
    }

    if (!password) {
        return res.status(422).send({
            error: true,
            msg: 'You must enter a password'
        });
    }

    User.findOne({
        email: email
    }, function(err, excistingUser) {

        if (err) {
            return next({
                error: true,
                msg: err.msg
            });
        }

        if (excistingUser) {
            return res.status(422).send({
                error: true,
                msg: 'That email address is already in use'
            });
        }

        var user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            profileInfo: profile,
        });


        user.save(function(err, user) {
            if (err) {
                return next(err);
            }

            var userInfo = setUserInfo(user);

            res.status(201).json({
                error: null,
                msg: 'User was created successfully',
                token: 'JWT ' + generateToken(userInfo),
                user: {
                    firstname: userInfo.firstname,
                    _id: userInfo._id,
                    role: userInfo.role,
                    status: userInfo.status
                }
            });
        });
    });
}

exports.roleAuthorization = function(roles) {
    return function(req, res, next) {

        var user = req.user;


        User.findById(user._id, function(err, foundUser) {

            if (err) {
                res.status(422).json({
                    error: true,
                    msg: 'No user found.'
                });
                return next(err);
            }

            if (roles.indexOf(foundUser.role) > -1) {
                return next();
            }

            res.status(401).json({
                error: true,
                msg: 'You are not authorized to view this content.'
            });
            return next('Unauthorized blabla');
        });
    }
}
