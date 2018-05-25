const ExpressPeerServer = require('peer').ExpressPeerServer;

const initPeerServer = (server, app) => {

    const options = {
        debug: true,
    }

    app.use('/peerjs', ExpressPeerServer(server, options));

    server.on('connection', (id) => console.log(`peer connected: ${id}`));
    server.on('disconnect', (id) => console.log(`peer disconnected: ${id}`));
}


module.exports = {
    initPeerServer
};
