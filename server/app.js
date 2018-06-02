var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var databaseConfig = require('./config/database');
var passport = require('passport');



var appRoutes = require('./routes/app');
var authRoutes = require('./routes/user');
var chatRoutes = require('./routes/chat');

var app = express();

mongoose.connect(databaseConfig.url, {
    useMongoClient: true
});

let mc = mongoose.connection;
mc.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '../dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(cors());

// cors headers
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//     next();
// });


app.use('/user', authRoutes);
app.use('/chat', chatRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'dist/index.html'));
});


module.exports = app;
