var User = require('../models/user');
var Message = require('../models/message');
var Notification = require('../models/notification');
var ChatRoom = require('../models/chatRoom');
var helper = require('../utils/helper');


var socketConfig = function(io) {


    io.use(function(socket, next) {
        const userId = socket.handshake.query.userId;
        if (userId) {
            console.log('Before save userId: ' + userId + ' / socketId: ' + socket.id);
            User.findOneAndUpdate({ _id: userId }, { socketId: socket.id }, { new: true }, function(err, user) {
                if (err) {
                    next(err);
                }
                console.log('After save userId: ' + user._id + ' / socketId: ' + user.socketId);

                next();
            });
        } else {
            next();
        }

    });

    io.on('connection', (socket) => {
        console.log('connected.');

        socket.on('call', (data) => {
            console.log('Calling...');
            const roomId = data.roomId;
            const userId = data.userId;

            io.to(roomId).emit('receiving-call', { callFrom: { room: roomId, user: userId } });
        });

        socket.on('call-answer', (data) => {
            const answer = data.answer;
            const user = data.userId;
            const roomId = data.roomId;

            console.log('call answer received');
            console.log(data);
            if (answer) {

                console.log('joined call');


            } else {
                console.log('didnt pick up');
            }
        });


        socket.on('video-socket-join-room', (data) => {
            const roomId = data.roomId;
            const userId = data.userId;

            console.log('video socket joined');
            console.log(roomId);
            console.log(userId);
            socket.join(roomId);

            ChatRoom.findOneAndUpdate({ _id: roomId }, { $push: { inCall: userId } }, { new: true }, (err, room) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(room);
                    io.to(roomId).emit('room-call', room);
                }
            });

            socket.broadcast.to(roomId).emit('joined-video-call', userId);
        });

        socket.on('call-leave', (data) => {
            const roomId = data.roomId;
            const userId = data.userId;

            ChatRoom.findById(roomId, (err, room) => {
                if (err) {
                    console.log(err);
                } else {
                    room.inCall.filter((user, index, arr) => {
                        if (user.toString() === userId) {
                            room.inCall.pull(user);
                            console.log('user left call');
                        }
                    });
                    room.save((err, savedRoom) => {
                        console.log('user left room emited');
                        io.to(roomId).emit('user-call-leave', savedRoom);
                    });

                }
            });
        });

        // socket.on('call', (data) => {
        //     console.log('Calling...');
        //     const roomId = data.roomId;
        //     io.to(roomId).emit('receive-call', socket.id);
        // });

        // Messaging logic
        socket.on('create-chatroom', (data) => {
            const roomName = data.roomName;
            const creatorId = data.creatorId;
            const users = [];
            users.push(creatorId);

            let roomCreationResponse = {};

            if (!roomName) {

                roomCreationResponse.error = true;
                roomCreationResponse.message = `Please enter a room name!`;
                io.to(socket.id).emit('create-chatroom-response', roomCreationResponse);


            }
            if (data.users) {
                data.users.forEach(function(userId) {
                    User.findById(userId, function(err, usertoAdd) {

                        users.push(usertoAdd._id);
                    });
                });
            }
            User.findOne({ _id: creatorId }, function(err, user) {

                const chatRoom = new ChatRoom({
                    name: roomName,
                    creator: user,
                    users: users
                });

                chatRoom.save(function(err, room) {

                    users.forEach(function(userInRoom) {
                        User.findById(userInRoom, function(err, userToUpdate) {
                            userToUpdate.joinedRooms.push({ room: room._id, joinedAt: new Date() });
                            userToUpdate.save();

                            roomCreationResponse.error = false;
                            roomCreationResponse.message = `room was created`;
                            roomCreationResponse.newRoom = room;

                            io.to(userToUpdate.socketId).emit('room-list-response', roomCreationResponse);
                        });
                    });

                    console.log('Room CREATED!');
                });
            });
        });

        socket.on('create-private-room', (data) => {

            userId = data.userId;
            withUserId = data.withUser._id;

            createPrivateRoomResponse = {};

            ChatRoom.findOne({ $or: [{ users: [userId, withUserId], type: "system" }, { users: [withUserId, userId], type: "system" }] }, function(err, room) {

                if (!room) {
                    // create room
                    const privateRoom = new ChatRoom({
                        name: userId + withUserId,
                        creator: userId,
                        users: [userId, withUserId],
                        type: 'system'
                    });

                    privateRoom.save(function(err, savedRoom) {
                        savedRoom.users.forEach(function(userInRoom) {
                            User.findById(userInRoom, function(err, userToUpdate) {
                                userToUpdate.joinedRooms.push({ room: savedRoom._id, joinedAt: new Date() });
                                userToUpdate.save();
                            });
                        });
                        createPrivateRoomResponse.error = false;
                        createPrivateRoomResponse.room = savedRoom;
                        io.to(socket.id).emit('create-private-room-response', createPrivateRoomResponse);
                        io.to(data.withUser.socketId).emit('create-private-room-response', createPrivateRoomResponse);

                    });
                    console.log('private room created');
                } else {
                    //return the found room
                    createPrivateRoomResponse.error = false;
                    createPrivateRoomResponse.room = room;
                    io.to(socket.id).emit('create-private-room-response', createPrivateRoomResponse);
                }
            });
        });

        socket.on('join-room', (data) => {

            const room = data.room;
            socket.join(room._id);
            console.log(socket.id + ' joined: ' + room._id);

        });

        socket.on('add-person', (data) => {

            console.log(data);
            const room = data.room;
            const persons = data.personsToAdd;

            if (!room) {

                console.log('error');

            } else if (!persons) {

                console.log('error');

            } else {

                User.find({ _id: { $in: persons } }, function(err, personsToAdd) {

                    ChatRoom.findOneAndUpdate({ _id: room._id }, { $pushAll: { users: persons } }, { new: true }, function(err, updatedRoom) {
                        console.log(updatedRoom);
                        personsToAdd.forEach(function(obj) {
                            obj.joinedRooms.push({ room: room._id, joinedAt: new Date() });
                            obj.save();
                            io.to(obj.socketId).emit('room-list-response', {
                                error: false,
                                message: `You've been added to: ` + updatedRoom.name,
                                addedToRoom: true,
                                room: updatedRoom
                            });
                        });

                        io.to(updatedRoom._id).emit('room-list-response', {
                            error: false,
                            message: ' someone joined the room',
                            personJoined: true,
                            room: updatedRoom
                        });
                    });
                });
            }
        });

        socket.on('leave-chatroom', (data) => {

            const userId = data.userId;
            const roomId = data.roomId;

            let leaveChatRoomResponse = {};

            ChatRoom.findById(roomId, function(err, room) {

                if (err) {
                    leaveChatRoomResponse.error = true;
                    leaveChatRoomResponse.message = `Room with id: ` + roomId + `doesn't exist`;
                    io.to(socket.id).emit('room-list-response', leaveChatRoomResponse);
                } else {
                    User.findOneAndUpdate({ _id: userId }, { $pull: { joinedRooms: { room: room._id } } }, function(err, user) {

                        if (err) {
                            leaveChatRoomResponse.error = true;
                            leaveChatRoomResponse.message = `You are not logged in! Please log in and try again.`;
                            io.to(socket.id).emit('room-list-response', leaveChatRoomResponse);
                        } else {
                            room.users.pull(userId);
                            socket.leave(room._id);

                            if (room.users.length === 0) {
                                room.remove();
                            } else {

                                room.save(function(err, savedRoom) {
                                    io.to(room._id).emit('room-list-response', {
                                        someoneLeftRoom: true,
                                        room: savedRoom
                                    });
                                });
                            }
                        }
                    });
                }

            });
        });

        socket.on('notifications', (data) => {

            const userId = data.userId;
            let notificationResponse = {};
            console.log('notifications extracting');

            if (!data.userId) {
                notificationResponse.error = true;
                notificationResponse.message = `You haven't joined any room!`;
                io.to(socket.id).emit('notifications-response', notificationResponse);

            } else {

                Notification.find({ notSeenBy: { $in: [userId] } }, function(err, notificationsFound) {
                    notificationResponse.error = false;
                    notificationResponse.message = 'initial notifications';
                    notificationResponse.initialNotifications = true;
                    notificationResponse.notifications = notificationsFound;
                    io.to(socket.id).emit('notifications-response', notificationResponse);

                });
            }
        });

        socket.on('notifications-seen', (data) => {

            const room = data.room;
            const userId = data.userId;

            Notification.find({ to: room._id }, function(err, notifications) {
                console.log(notifications);
                if (notifications) {
                    notifications.forEach(function(notification) {
                        if (notification.notSeenBy.find(x => x.toString() === userId)) {

                            notification.notSeenBy.pull(userId);

                            if (notification.notSeenBy.length === 0) {
                                io.to(room._id).emit('notifications-seen-response', notification);
                                notification.remove();
                            } else {
                                notification.save(function(err, savedNotification) {

                                    io.to(room._id).emit('notifications-seen-response', savedNotification);
                                });
                            }
                        }
                    });
                }
            });
        });

        socket.on('chat-list', (data) => {
            let chatListResponse = {};
            console.log(data);

            if (data.userId === '') {
                chatListResponse.error = true;
                chatListResponse.message = 'User doesn\'t exist';
                //TODO: double check logic!
                io.to(socket.id).emit('chat-list-response', chatListResponse);
            } else {

                User.findById({ _id: data.userId }, function(err, user) {

                    //TODO: add error check!
                    var userInfo = helper.setUserInfo(user);

                    User.find({ status: 'online' }, function(err, users) {

                        if (err) {
                            io.to(socket.id).emit('chat-list-response', {
                                error: err
                            });
                        }

                        var usersInfo = helper.setUsersInfo(users);

                        io.to(socket.id).emit('chat-list-response', {
                            error: false,
                            singleUser: false,
                            chatList: usersInfo
                        });

                        socket.broadcast.emit('chat-list-response', {
                            error: false,
                            singleUser: true,
                            chatList: userInfo
                        });
                    });
                });
            }
        });

        socket.on('room-list', (data) => {
            let roomListResponse = {};

            if (!data.userId) {
                roomListResponse.error = true;
                roomListResponse.message = `You are not logged in! Please log in and try again!`;
                io.to(socket.id).emit('room-list-response', roomListResponse);
            } else {

                const userId = data.userId;

                ChatRoom.find({ users: userId }, function(err, room) {

                    if (err) {
                        roomListResponse.error = err;
                        io.to(socket.id).emit('room-list-response', roomListResponse);
                    } else {

                        roomListResponse.error = false;
                        roomListResponse.roomList = room;
                        io.to(socket.id).emit('room-list-response', roomListResponse);
                    }

                });
            }
        });

        socket.on('add-message', (data) => {

            console.log('add msg event');

            if (data.content === '') {

                io.to(socket.id).emit('add-message-response', `Message cant be empty`);

            } else if (data.from === '') {

                io.to(socket.id).emit('add-message-response', `Unexpected error, Login again.`);

            } else if (data.to === '') {

                io.to(socket.id).emit('add-message-response', `Select a user to chat.`);

            } else {

                const message = new Message({
                    content: data.content,
                    to: data.to,
                    from: data.from
                });

                // console.log(message);

                ChatRoom.findById({ _id: data.to }, function(err, room) {

                    if (!room) {
                        io.to(socket.id).emit('add-message-response', `Message couldn't be sent. The room you are trying to reach doesn't exist`);
                    } else {

                        const notSeenBy = room.users.filter(x => x.toString() !== message.from);
                        console.log(notSeenBy);
                        const notification = new Notification({
                            title: 'newMessage',
                            to: data.to,
                            from: data.from,
                            notSeenBy: notSeenBy
                        });

                        notification.save(function(err, savedNotification) {
                            if (err) {
                                io.to(socket.id).emit('add-message-response', `Message couldn't be sent. Please try again.`);
                                console.log(err);
                            } else {

                                message.save(function(err, savedMessage) {
                                    if (err) {

                                        io.to(socket.id).emit('add-message-response', `Message couldn't be sent. Please try again.`);
                                        console.log(err);

                                    } else {
                                        io.to(room._id).emit('add-message-response', savedMessage);
                                        io.to(room._id).emit(`notifications-response`, {
                                            error: false,
                                            singleNotification: true,
                                            notifications: savedNotification
                                        });
                                        room.messages.push(savedMessage._id);
                                        room.save();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });


        socket.on('disconnect', () => {
            console.log('disconnected ' + socket.id);
            socket.broadcast.emit('chat-list-response', {
                error: false,
                userDisconnected: true,
                socketId: socket.id
            });
        });

    });
};

module.exports = socketConfig;