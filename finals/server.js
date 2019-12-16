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
httpServer.listen(9999);

console.log('Server listening on port 9999');

// WebSocket Portion
// WebSockets work with the HTTP server
let userArr = [];
let controlArr = ["spine", "neck", "lArm", "rArm"];
var io = require('socket.io').listen(httpServer);
io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);
        let partsControl = {
            "id": socket.id,
            "control": controlArr[0],
            "x": 0,
            "y": 0
        }
        controlArr.splice(0, 1);
        userArr.push(partsControl);
        socket.on('mousePos', function (data) {
            // console.log(data);
            //find out which user is it (which object in userArr need to be updatd)
            userArr.forEach(function (user) {
                if (user.id == socket.id) {
                    //update that partsControl objg in arrays on the server
                    user.x = data.x;
                    user.y = data.y;
                    //send that updated object tgt to all client
                    io.sockets.emit("other", userArr);
                }
            })
        });
        socket.on('selectTask', function (data) {
            console.log(data);
            socket.emit("changeTask", data);
        })
        socket.on('devOrient', data => {
            // console.log(data);
            io.sockets.emit("devOrient", data);
        });
        socket.on('devMotion', data => {
            // console.log(data);
            io.sockets.emit("devMotion", data);
        });
        socket.on('devTouch', data => {
            // console.log(data);
            io.sockets.emit("devTouch", data);
        })
        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });
    }
);
