var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var uniqueValidator = require('mongoose-unique-validator');

var chatRoomSchema = new mongoose.Schema({

    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    inCall: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: {
        type: String,
        enum: ['system', 'public'],
        default: 'public'
    }

}, {
    timestamps: true
});


chatRoomSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);