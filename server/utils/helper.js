var User = require('../models/user');
var Message = require('../models/message');

exports.setUserInfo = function(user) {

    const userInfo = {
        firstname: user.firstname,
        lastname: user.lastname,
        _id: user._id,
        socketId: user.socketId,
        email: user.email,
        role: user.role,
        profileInfo: user.profileInfo,
        status: user.status
    };

    return userInfo;
}
exports.setUsersInfo = function(users) {
    var usersInfo = [];
    users.forEach(function(user) {
        usersInfo.push({
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id,
            socketId: user.socketId,
            email: user.email,
            role: user.role,
            profileInfo: user.profileInfo,
            status: user.status
        });
    });
    return usersInfo;
}