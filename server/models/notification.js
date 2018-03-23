var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var NotificationSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    notSeenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);