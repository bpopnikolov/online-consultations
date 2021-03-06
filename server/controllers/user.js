var User = require('../models/user');
var helper = require('../utils/helper');



exports.getUsers = async (req, res, next) => {
    let users = await User.find();
    users = users.map((x) => ({
        _id: x._id,
        firstname: x.firstname,
        lastname: x.lastname,
        email: x.email,
        role: x.role,
        profileInfo: x.profileInfo
    }));
    console.log(users);
    return res.status(200).json(users);
}

exports.updateUserRole = async (req, res, next) => {
    const user = req.body;
    try {
        const updatedUser = await User.update({
            _id: user._id
        }, {
            role: user.role
        });
    } catch (e) {
        return res.status(400).json({
            error: true,
            msg: `User role wasn't updated`
        })
    }

    return res.status(200).json({
        error: false,
        msg: `User role was updated`
    });
};

exports.getUser = function(req, res, next) {

    const userId = req.body.userId;
    User.findById({
        _id: userId
    }, function(err, user) {
        if (err) {
            res.status(500).json({
                error: 'Server error: ' + err
            });
        } else {

            const userInfo = helper.setUserInfo(user);
            res.status(200).json(userInfo);

        }
    });
}

exports.setUserProfile = function(req, res, next) {
    const userId = req.body.userId;
    const email = req.body.email;
    const profileInfo = req.body.profileInfo;

    User.findById(userId, function(err, user) {

        if (err) {
            res.status(500).json({
                error: 'Server error: ' + err
            });
        } else {
            user.email = email;
            user.profileInfo = profileInfo;
            user.save(function(err, savedUser) {
                res.status(200).json({
                    error: null,
                    msg: 'Profile has been set!',
                    user: savedUser
                });
            });
        }
    });
}

exports.changeUserPassword = function(req, res, next) {

    const userId = req.body.userId;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    console.log(currentPassword);
    console.log(newPassword);

    User.findById(userId, function(err, user) {

        if (err) {
            res.status(500).json({
                error: 'Server error: ' + err
            });
        } else if (user) {

            user.comparePassword(currentPassword, function(compareErr, isMatch) {
                if (compareErr) {
                    res.status(500).json({
                        error: 'Server error: ' + err
                    });
                }
                if (isMatch) {
                    if (currentPassword !== newPassword) {
                        user.password = newPassword;
                        user.save(function(err, savedUser) {
                            res.status(200).json({
                                error: null,
                                msg: 'Password was chaged successfully'
                            });
                        });
                    } else {
                        res.status(200).json({
                            error: true,
                            msg: `This password is already in use. `
                        });
                    }
                } else {
                    res.status(200).json({
                        error: true,
                        msg: `Your current password doesn't match `
                    });
                }

            });
        }

    });


}

exports.getOnlineUsers = function(req, res, next) {

    User.find({
        status: 'online'
    }, function(err, users) {
        if (err) {
            res.status(500).json({
                error: 'Server error: ' + err
            });
        } else {
            res.status(200).json({
                users: users
            });
        }
    });
}
