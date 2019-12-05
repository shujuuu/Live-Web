// let socket = io.connect();
// socket.on('connect', function () {
//     console.log("Connected");
// });

// //1. orientation
// function onOrientationChange(e) {
//     console.log(e);

//     let alpha = Math.floor(e.alpha),
//         beta = Math.floor(e.beta),
//         gamma = Math.floor(e.gamma);

//     let orient = document.getElementById('orient');
//     orient.innerHTML = `alpha: ${alpha}degrees<br/> beta:  ${beta}degrees<br/> gamma:  ${gamma}degrees`;
//     let orientValues = {
//         x: alpha,
//         y: beta,
//         z: gamma
//     }
//     socket.emit('singleOrient', orientValues);
//     socket.on('everyonesOrient', data => {
//         console.log(data);
//     })
// }
// //2. motion 
// //can have with gravity, if grater than x, do something
// //flip to silent, driving games, reset a form, undo an action
// function ondevicemotion(e) {
//     let x = Math.floor(e.acceleration.x),
//         y = Math.floor(e.acceleration.y),
//         z = Math.floor(e.acceleration.z);

//     let motion = document.getElementById('motion');
//     motion.innerHTML =
//         `acceleration x: ${x} <br/>acceleration y: ${y} <br/>acceleration z: ${z}`;
// }

// //3. direction, for safari mobile browser only
// // function handleCompassEvent(e) {
// //     let compassHeading = e.webkitCompassHeading;
// //     let compass = document.getElementById('compass');
// //     compass.innerHTML = `compass due N: ${compassHeading} degree`;
// // }


// //4. touch --> not working
// //touch, moves, removes
// //current position of touchscreen
// function handleTouchEvent(e) {
//     let allTouches = e.touches,
//         allTouchesLength = allTouches.length;
//     let touch = document.getElementById('touch');

//     if (e.type === 'touchstart') {
//         e.preventDefault();
//     }
//     touch.innerHTML = `${allTouchesLength} touched the screen`;
// }

// // if (window.DeviecOrientationEvent) {
// // console.log('DeviecOrientation supported');
// window.addEventListener('deviceorientation', onOrientationChange, false);
// window.addEventListener('devicemotion', ondevicemotion, false);
// window.addEventListener('devicemotion', handleCompassEvent, false);
// window.addEventListener('touchstart', handleTouchEvent, false);
// // window.addEventListener('touchend', handleTouchEvent, false);
// // } else {
// // 	console.log('DeviecOrientation NOTTTT supported');
// // }


// //5. 3d asset
// //set normal scene: scene,cam,light,model;
// let scene, cam, renderer, controls;
// let ambientLight, directionalLight;
// let loaderCar, car, loaderAvatar, avatar;

// function init() {
//     setScene();
//     loadCar();
//     loadAvatar();
// }

// function setScene() {
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xdddddd);

//     camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
//     camera.rotation.y = 45 / 180 * Math.PI; //rotate by 45degrees
//     camera.position.x = 800;
//     camera.position.y = 100;
//     camera.position.z = 1000;

//     ambientLight = new THREE.AmbientLight(0x404040, 100);
//     scene.add(ambientLight);
//     directionalLight = new THREE.DirectionalLight(0xffffff, 100);
//     directionalLight.position.set(0, 1, 0);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     renderer = new THREE.WebGLRenderer({
//         antialias: true
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement); //????domElement

//     controls = new THREE.OrbitControls(camera, renderer.domElement);
//     controls.addEventListener('change', renderer);
// }

// //load 3d object - car
// function loadCar() {
//     let loaderCar = new THREE.GLTFLoader();
//     loaderCar.load('car/scene.gltf', function (gltf) {
//         car = gltf.scene.children[0]; //get the model
//         car.scale.set(0.2, 0.2, 0.2); //set half size
//         scene.add(gltf.scene);
//         // renderer.render(scene, camera); //renders once
//         controlCamera(); //renders on update instead
//     }, undefined, function (error) {
//         console.error(error);
//     });
// }
// //load 3d object - avatar
// function loadAvatar() {
//     let loaderAvatar = new THREE.GLTFLoader();
//     loaderAvatar.load('avatar/scene.gltf', function (gltf) {
//         avatar = gltf.scene.children[0]; //get the model
//         avatar.scale.set(0.8, 0.8, 0.8); //set half size
//         scene.add(gltf.scene);
//         // renderer.render(scene, camera); //renders once
//         controlCamera(); //renders on update instead
//     }, undefined, function (error) {
//         console.error(error);
//     });
// }

// //update camera
// function controlCamera() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(controlCamera);
// }
// init();