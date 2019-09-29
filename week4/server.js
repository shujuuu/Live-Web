// HTTPS portion
let http = require('http');
let express = require('express');
let app = express();
let server = http.createServer(app);
let io = require('socket.io').listen(server);

server.listen(8088);
console.log('listening on port 8080')
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

let connections = [];
let users = [];
// WebSocket portion
io.sockets.on('connection', socket => {
    connections.push(socket.id);
    console.log('connected: %s sockets connected', connections.length);
    console.log(connections);

    //disconnect
    socket.on('disconnect', socket => {
        console.log('disconnected: %s sockets connected', connections.length);
    })

    //get mouse move
    socket.on('mouseMove', pos => {
        io.emit(pos);
    })

    //get mouse click
    socket.on('mouseClicked', data => {
        io.emit('sendImage', data);
    })
})
