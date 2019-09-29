// HTTP Portion
// var http = require('http');
// var fs = require('fs'); // Using the filesystem module
// var httpServer = http.createServer(requestHandler);
// var url = require('url');
// httpServer.listen(8083);
// console.log('listening on port 8083')

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

// HTTPS
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
var io = require('socket.io').listen(httpServer);

//Communication
io.on('connection',
    function (socket) {
        //Push users to array
        // socket.on('connect', function () {
        let clients = [];
        let clientCount = 0;
        let pushUser = false;
        console.log("Client: " + socket.id + " is connected");
        for (let i = 0; i < socket.length; i++) {
            clientCount++;
            clients.push(socket.id);
            // if (socket.id == users[i].id) {
            //     users[i] = socket.id;
            // }
            console.log(clients);
        }
        socket.emit('totalRunners', clients);
        // })

        // Receives and emit all users current scroll position
        socket.on('scroll',
            function (data) {
                console.log(`user ${socket.id} scrolled + ${data}`);
                io.emit('scroll', data);
            });

        //Game ended
        socket.on('endGame', didWin => {
            let winners = [];
            console.log(socket.id);
            console.log(didWin);
            winners.push(didWin);
            if (didWin) {
                socket.emit('endGameMsg', {
                    user: socket.id,
                    // rank: winners[i]
                });
            }
        })

        //disconnect
        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);
