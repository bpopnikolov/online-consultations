var User = require('../models/user');
var Message = require('../models/message');
var Notification = require('../models/notification');
var ChatRoom = require('../models/chatRoom');
var helper = require('../utils/helper');


var socketConfig = function(io) {


    io.use(async (socket, next) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            console.log('Before save userId: ' + userId + ' / socketId: ' + socket.id);

            const socketUser = await User.findById(userId);

            if (socketUser) {
                await User.update({
                    _id: socketUser._id
                }, {
                    status: 'online',
                    $push: {
                        socketIds: socket.id
                    }
                });
            }
            socket.broadcast.emit('user-connected', helper.setUserInfo(socketUser));
            return next();
        }

        return next();
    });

    io.on('connection', (socket) => {
        console.log('connected.');

        socket.on('call', (data) => {
            console.log('Calling...');
            const roomId = data.roomId;
            const userId = data.userId;

            io.to(roomId).emit('receiving-call', {
                callFrom: {
                    room: roomId,
                    user: userId
                }
            });
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

            ChatRoom.findOneAndUpdate({
                _id: roomId
            }, {
                $push: {
                    inCall: userId
                }
            }, {
                new: true
            }, (err, room) => {
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
            User.findOne({
                _id: creatorId
            }, function(err, user) {

                const chatRoom = new ChatRoom({
                    name: roomName,
                    creator: user,
                    users: users
                });

                chatRoom.save(function(err, room) {

                    users.forEach(function(userInRoom) {
                        User.findById(userInRoom, function(err, userToUpdate) {
                            userToUpdate.joinedRooms.push({
                                room: room._id,
                                joinedAt: new Date()
                            });
                            userToUpdate.save();

                            roomCreationResponse.error = false;
                            roomCreationResponse.message = `room was created`;
                            roomCreationResponse.newRoom = room;
                            // TODO: loop through all user sockets
                            userToUpdate.socketIds.forEach((socketId) => {
                                io.to(socketId).emit('room-list-response', roomCreationResponse);
                            });
                        });
                    });

                    console.log('Room CREATED!');
                });
            });
        });

        socket.on('create-private-room', async (data) => {
            userId = data.userId;
            withUserId = data.withUser._id;

            const firstUser = await User.findById(userId);
            const secondUser = await User.findById(withUserId);

            createPrivateRoomResponse = {};

            ChatRoom.findOne({
                $or: [{
                    users: [firstUser._id, secondUser._id],
                    type: "system"
                }, {
                    users: [secondUser._id, firstUser._id],
                    type: "system"
                }]
            }, function(err, room) {

                if (!room) {
                    // create room
                    const privateRoom = new ChatRoom({
                        name: userId + withUserId,
                        creator: userId,
                        users: [firstUser._id, secondUser._id],
                        type: 'system'
                    });

                    privateRoom.save(function(err, savedRoom) {
                        savedRoom.users.forEach(function(userInRoom) {
                            User.findById(userInRoom, function(err, userToUpdate) {
                                userToUpdate.joinedRooms.push({
                                    room: savedRoom._id,
                                    joinedAt: new Date()
                                });
                                userToUpdate.save();
                            });
                        });

                        createPrivateRoomResponse.error = false;
                        createPrivateRoomResponse.room = savedRoom;

                        firstUser.socketIds.forEach((socket) =>
                            io.to(socket).emit('create-private-room-response', createPrivateRoomResponse));
                        secondUser.socketIds.forEach((socket) =>
                            io.to(socket).emit('create-private-room-response', createPrivateRoomResponse));

                    });
                    console.log('private room created');
                } else {
                    //return the found room
                    createPrivateRoomResponse.error = false;
                    createPrivateRoomResponse.room = room;
                    firstUser.socketIds.forEach((socket) =>
                        io.to(socket).emit('create-private-room-response', createPrivateRoomResponse));
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

                User.find({
                    _id: {
                        $in: persons
                    }
                }, function(err, personsToAdd) {

                    ChatRoom.findOneAndUpdate({
                        _id: room._id
                    }, {
                        $pushAll: {
                            users: persons
                        }
                    }, {
                        new: true
                    }, function(err, updatedRoom) {
                        console.log(updatedRoom);
                        personsToAdd.forEach((obj) => {
                            obj.joinedRooms.push({
                                room: room._id,
                                joinedAt: new Date()
                            });
                            obj.save();

                            obj.socketIds.forEach((socket) =>
                                io.to(socket).emit('room-list-response', {
                                    error: false,
                                    message: `You've been added to: ` + updatedRoom.name,
                                    addedToRoom: true,
                                    room: updatedRoom
                                }));
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
                    User.findOneAndUpdate({
                        _id: userId
                    }, {
                        $pull: {
                            joinedRooms: {
                                room: room._id
                            }
                        }
                    }, function(err, user) {

                        if (err) {
                            leaveChatRoomResponse.error = true;
                            leaveChatRoomResponse.message = `You are not logged in! Please log in and try again.`;
                            user.socketIds.forEach((socket) =>
                                io.to(socket).emit('room-list-response', leaveChatRoomResponse));
                        } else {
                            room.users.pull(userId);

                            user.socketIds.forEach((id) => {
                                const socket = io.sockets.connected[id];
                                socket.leave(room._id);
                            });

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
                Notification.find({
                    notSeenBy: {
                        $in: [userId]
                    }
                }, function(err, notificationsFound) {
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

            Notification.find({
                to: room._id
            }, function(err, notifications) {
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

        socket.on('chat-list', async (data) => {
            let chatListResponse = {};
            console.log(data);

            if (!data.userId) {
                chatListResponse.error = true;
                chatListResponse.message = 'User doesn\'t exist';
                return io.to(socket.id).emit('chat-list-response', chatListResponse);
            }

            const user = await User.findById(data.userId);

            if (user) {
                const onlineUsers = await User.find({
                    status: 'online'
                });
                const onlineUsersInfo = helper.setUsersInfo(onlineUsers);

                return io.to(socket.id).emit('chat-list-response', {
                    error: false,
                    chatList: onlineUsersInfo,
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

                ChatRoom.find({
                    users: userId
                }, function(err, room) {

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

                ChatRoom.findById({
                    _id: data.to
                }, function(err, room) {

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


        socket.on('disconnect', async () => {
            console.log('disconnected ' + socket.id);

            const user = await User.findOneAndUpdate({
                socketIds: socket.id
            }, {
                $pull: {
                    socketIds: socket.id
                }
            }, {
                new: true
            });
            if (user && user.socketIds.length === 0) {
                await User.update({
                    _id: user._id
                }, {
                    status: 'offline'
                });
                console.log(user);
                socket.broadcast.emit('user-disconnected', helper.setUserInfo(user));
            }

        });

    });
};

module.exports = socketConfig;
