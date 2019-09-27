// HTTP Portion
// var http = require('http');
// var fs = require('fs'); // Using the filesystem module
// var httpServer = http.createServer(requestHandler);
// var url = require('url');
// httpServer.listen(8085);
// console.log('listening on port 8085')

// function requestHandler(req, res) {
//     var parsedUrl = url.parse(req.url);
//     console.log("The Request is: " + parsedUrl.pathname);

//     // Read in the file they requested

//     fs.readFile(__dirname + parsedUrl.pathname,
//         // Callback function for reading
//         function (err, data) {
//             // if there is an error
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading ' + parsedUrl.pathname);
//             }
//             // Otherwise, send the data, the contents of the file
//             res.writeHead(200);
//             res.end(data);
//         }
//     );
// }

var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url = require('url');

var options = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
};

function handleIt(req, res) {
    var parsedUrl = url.parse(req.url);

    var path = parsedUrl.pathname;
    if (path == "/") {
        path = "index.html";
    }

    fs.readFile(__dirname + path,

        // Callback function for reading
        function (err, fileContents) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(fileContents);
        }
    );

    // Send a log message to the console
    console.log("Got a request " + req.url);
}

var httpServer = https.createServer(options, handleIt);
httpServer.listen(8085);



// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        console.log("We have a new client: " + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('scroll',
            function (data) {
                // Data comes in as whatever was sent, including objects
                console.log("Received: 'user scrolled to' " + data);
                io.emit('scroll', data)
            });

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);
