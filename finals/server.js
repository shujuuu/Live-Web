// HTTP Portion
var http = require('http');
var fs = require('fs');
var url = require('url');
var httpServer = http.createServer(requestHandler);
httpServer.listen(9000);
console.log('listening 9000');

function requestHandler(req, res) {
    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);
    fs.readFile(__dirname + parsedUrl.pathname,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}

// WebSocket Portion
var io = require('socket.io').listen(httpServer);
io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);
        socket.on('chatmessage', function (data) {
            console.log("Received: 'chatmessage' " + data);
            socket.broadcast.emit('chatmessage', data);
            socket.broadcast.emit('chatmessage', socket.id);
        });

        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });
    }
);
