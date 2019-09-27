// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler); //could be handled with express
var url = require('url');
httpServer.listen(8082);

function requestHandler(req, res) {

    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);

    fs.readFile(__dirname + parsedUrl.pathname,
        // Callback function for reading
        function (err, data) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            // Otherwise, send the data, the contents of the file
            //res.writeHead(200, { 'Content-Type': mime.lookup(__dirname + parsedUrl.pathname) });
            res.writeHead(200);

            res.end(data);
        }
    );

    /*
    res.writeHead(200);
    res.end("Life is wonderful");
    */
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        //make a topic to talk about
        //socket.on('giveTopic', function () {
        let topicsArr = ['weather', 'light', 'U.S. China Trade War', 'gummy bear', 'Filipino food',
            'myopic', 'javascript', 'God', 'ITP', 'quarter-life crisis'
        ];
        let randomInt = Math.floor(Math.random() * 10);
        let topic = topicsArr[randomInt];
        console.log(randomInt, topic);
        io.sockets.emit('giveTopic', topic); //to eevryone
        //})

        //get id of all the sockets
        console.log("We have a new client: " + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('chatmessage', function (data) {
            // Data comes in as whatever was sent, including objects
            console.log("Received: 'chatmessage' " + data);

            // Send it to all of the clients
            socket.broadcast.emit('chatmessage', data);
            socket.broadcast.emit('chatmessage', socket.id) //not working?
        });

        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });
    }
);