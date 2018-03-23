var User = require('../models/user');
var Message = require('../models/message');

exports.getMessages = function(req, res, next) {

    const fromId = req.body.fromId;
    const toId = req.body.toId;
    var messages = {};
    console.log(req.body);


    if (fromId === '') {

        messages.error = `userId can't be empty.`;
        res.status(400).json(messages);

    } else if (toId === '') {

        messages.error = `toUserId can't be empty`;
        res.status(400).json(messages);

    } else {

        User.findById(fromId, function(err, user) {
            // console.log(user);
            let room = user.joinedRooms.find(x => x.room == toId);
            // console.log(room);
            if (room) {
                let startDate = room.joinedAt;
                // console.log(startDate);

                Message.find({ to: toId, createdAt: { $gte: startDate } }).sort({ timestamp: 1 }).exec(function(err, result) {
                    if (err) {

                        messages.error = `Server error: ` + err;
                        res.status(500).json(messages);

                    } else {
                        messages.error = null;
                        messages.messages = result;
                        res.status(200).json(messages);

                    }
                });
            }


        });

    }

}