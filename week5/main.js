var peerData = [];
var mypeerid;
// I setup a peer server on a Digital Ocean instance for our use, you can use that with the following constructor:
var peer = new Peer({
    host: 'liveweb-new.itp.io',
    port: 9000,
    path: '/'
});

//socket on
var socket = io.connect();
socket.on('connect', function () {
    console.log("Connected");
});

// Get an ID from the PeerJS server
peer.on('open', function (id) {
    //console.log('My peer ID is: ' + id);
    mypeerid = id;
});

peer.on('error', function (err) {
    console.log(err);
});

socket.on('new peer enter', function (data) {
    console.log("new peer in!!!!!!!");
    //create div and img
    var length = data.length;
    var imageDom = document.getElementById('images');

    for (let i = 0; i < length; i++) {
        imageDom.children[i].src = data[i].img;
        imageDom.children[i].setAttribute('id', data[i].peerid);

        imageDom.children[i].addEventListener('click', function () {
            console.log('clicked: ' + data[i].peerid);
            makeCall(data[i].peerid)
        });
    }

    // data.forEach(item => {
    //     console.log(item);
    //     console.log(data.length);
    //     let createDiv = document.createElement('div');
    //     let createImg = document.createElement('img');
    //     let container = document.getElementById('container');
    //     createDiv.classList.add('users', 'square');
    //     createDiv.setAttribute('id', item.peerid);
    //     createImg.src = item.img;
    //     createDiv.appendChild(createImg);
    //     container.appendChild(createDiv);

    //  })
});

socket.on('new peer enter to all', (data) => {
    console.log("a new peer joined: " + data[data.length - 1].id + "  peerid：" + data[data.length - 1].peerid + "   imagedata：" + data[data.length - 1].img);
    var length = data.length;
    var imageDom = document.getElementById('images');

    for (let i = 0; i < length; i++) {
        imageDom.children[i].src = data[i].img;
        imageDom.children[i].setAttribute('id', data[i].peerid);

        imageDom.children[i].addEventListener('click', function () {
            console.log('clicked: ' + data[i].peerid);
            makeCall(data[i].peerid)
        });
    }
});

let container = document.getElementById('container');
let myvideo = document.getElementById('myvideo');
let othervideo = document.getElementById('othervideo');
let crop = document.getElementById('crop');

peer.on('call', function (incoming_call) {
    console.log("Got a call!");
    var acceptsCall = confirm(" Blind Speed Date: Videocall incoming, do you want to accept it ?");

    if (acceptsCall) {
        incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
        incoming_call.on('stream', function (remoteStream) { // we receive a getUserMedia stream from the remote caller
            // And attach it to a video object
            var ovideoElement = document.getElementById('othervideo');
            ovideoElement.srcObject = remoteStream;
            ovideoElement.setAttribute("autoplay", "true");
            ovideoElement.play();
            // document.body.appendChild(ovideoElement);
            document.getElementById('myCrop').appendChild(ovideoElement);
        });
        // window.location.hash = "#othervideo";
    };

    document.getElementById('container').style.display = 'none';
    document.getElementById('othervideo').style.display = 'block';
    document.getElementById('myvideo').style.display = 'block';
    // let myvid = document.getElementById('myvideo');
    // document.getElementById('myCrop').appendChild(myvid);
});

function makeCall(idToCall) {
    var call = peer.call(idToCall, my_stream);

    call.on('stream', function (remoteStream) {
        // console.log("Got remote stream");
        var ovideoElement = document.getElementById('othervideo');
        // console.log(ovideoElement);
        ovideoElement.srcObject = remoteStream;
        ovideoElement.setAttribute("autoplay", "true");
        ovideoElement.play();
        // document.body.appendChild(ovideoElement);
        document.getElementById('otherCrop').appendChild(ovideoElement);
        // window.location.hash = "#othervideo";
    });

    document.getElementById('container').style.display = 'none';
    document.getElementById('othervideo').style.display = 'block';
    document.getElementById('myvideo').style.display = 'block';
    // document.getElementById('myCrop').appendChild('myvideo');
}


/* Get User Media */
let my_steam = null;
let webcamSettings = {
    audio: false,
    video: true,
    width: 360,
    height: 240
}


window.addEventListener('load', function () {

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let webcam = document.getElementById('myvideo');


    //if permission allowed
    navigator.mediaDevices.getUserMedia(webcamSettings)
        .then(function (stream) {

            // Global for stream

            webcam.srcObject = stream;
            webcam.onloadedmetadata = function (e) {
                webcam.play();
            }

            my_stream = stream;
            setTimeout(
                function () {
                    context.drawImage(webcam, 0, 0);
                    let snapshot = canvas.toDataURL('image/jpeg');
                    var mypeerData = {
                        id: mypeerid,
                        img: snapshot
                    };
                    //  console.log(snapshot);
                    peerData.push(mypeerData);
                    socket.emit('new peer', mypeerData);
                }, 800);
        })


        .catch(function (err) {
            console.log(err);
        })
})
