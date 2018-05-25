var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    profileInfo: {
        phone: {
            type: String
        },
        facultyNumber: {
            type: String
        },
        consultationsTime: {
            type: String
        },
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    socketIds: [{
        type: String
    }],
    joinedRooms: [{
        room: {
            type: Schema.Types.ObjectId,
            ref: 'ChatRoom'
        },
        joinedAt: {
            type: Date
        }
    }]
}, {
    timestamps: true
});

UserSchema.pre('save', function(next) {

    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {

        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch) {

        if (err) {
            return cb(err, null);
        } else {
            console.log(isMatch);
            cb(null, isMatch);
        }
    });
}


UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
