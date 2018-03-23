var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var MessageSchema = new mongoose.Schema({

    content: {
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
    }
}, {
    timestamps: true
});

MessageSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Message', MessageSchema);