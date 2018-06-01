#!/usr/bin/env node

/**
 * Module dependencies.
 */
var config = require('getconfig')
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();
var fs = require('fs');
var app = require('./server/app');
var debug = require('debug')('http');
var ioServer = require('socket.io');
var socketConfig = require('./server/config/socket');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.server.port);
app.set('port', port);
/**
 * Create HTTP server.
 */
var server = null;
if (config.server.secure) {
    server = require('https').createServer({
        key: fs.readFileSync(path.resolve(config.server.key)),
        cert: fs.readFileSync(path.resolve(config.server.cert)),
        passphrase: config.server.password
    }, app);
} else {
    server = require('http').createServer(app);
}

var io = new ioServer(server);
socketConfig(io);

Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        console.log("");
        console.log("Welcome to the Chat Sandbox");
        console.log("");
        console.log(`Test the chat interface from this device at : ", "https://localhost:${port}`);
        console.log("");
        console.log("And access the chat sandbox from another device through LAN using any of the IPS:");
        console.log("Important: Node.js needs to accept inbound connections through the Host Firewall");
        console.log("");

        if (alias >= 1) {
            console.log("Multiple ipv4 addreses were found ... ");
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, "https://" + iface.address + ':' + port);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, "https://" + iface.address + ':' + port);
        }

        ++alias;
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */
// var LANAccess = "0.0.0.0";
// server.listen(port, LANAccess);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
