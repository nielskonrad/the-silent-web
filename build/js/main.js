// define variables

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;

// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getData() {
  source = audioCtx.createBufferSource();
  var request = new XMLHttpRequest();

  request.open('GET', '../audio/song-12.2.1_01.mp3', true);

  request.responseType = 'arraybuffer';

  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;
        // console.log(buffer);
        source.connect(audioCtx.destination);
        source.loop = true;
      },
      function(e){ console.log("Error with decoding audio data" + e.err); });
  }
  request.send();
}

getData();
source.start(0);

var sound_started = false;

// document.addEventListener('keydown', function (evt) {
//   if (evt.keyCode === 32) {
//     if(audioCtx.state === 'running') {
//       audioCtx.suspend().then(function() {
//         console.log('Resume context');
//       });
//     } else if(audioCtx.state === 'suspended') {
//       audioCtx.resume().then(function() {
//         console.log('Suspend context');
//       });  
//     }
//     // sound_started = !sound_started
//   }
// });

// wire up buttons to stop and play audio

// play.onclick = function() {
//   getData();
//   source.start(0);
//   play.setAttribute('disabled', 'disabled');
// }

// stop.onclick = function() {
//   source.stop(0);
//   play.removeAttribute('disabled');
// }

// set up listener and panner position information
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var xPos = Math.floor(WIDTH/2);
var yPos = Math.floor(HEIGHT/2);
var zPos = 295;

// define other variables

var panner = audioCtx.createPanner();
panner.panningModel = 'HRTF';
panner.distanceModel = 'inverse';
panner.refDistance = 1;
panner.maxDistance = 10000;
panner.rolloffFactor = 1;
panner.coneInnerAngle = 360;
panner.coneOuterAngle = 0;
panner.coneOuterGain = 0;

if(panner.orientationX) {
  panner.orientationX.setValueAtTime(1, audioCtx.currentTime);
  panner.orientationY.setValueAtTime(0, audioCtx.currentTime);
  panner.orientationZ.setValueAtTime(0, audioCtx.currentTime);
} else {
  panner.setOrientation(1,0,0);
}

var listener = audioCtx.listener;

if(listener.forwardX) {
  listener.forwardX.setValueAtTime(0, audioCtx.currentTime);
  listener.forwardY.setValueAtTime(0, audioCtx.currentTime);
  listener.forwardZ.setValueAtTime(-1, audioCtx.currentTime);
  listener.upX.setValueAtTime(0, audioCtx.currentTime);
  listener.upY.setValueAtTime(1, audioCtx.currentTime);
  listener.upZ.setValueAtTime(0, audioCtx.currentTime);
} else {
  listener.setOrientation(0,0,-1,0,1,0);
}

var source;

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');

var boomBox = document.querySelector('.boom-box');

// var listenerData = document.querySelector('.listener-data');
// var pannerData = document.querySelector('.panner-data');

leftBound = (-xPos) + 50;
rightBound = xPos - 50;

xIterator = WIDTH/150;

// listener will always be in the same place for this demo

if(listener.positionX) {
  listener.positionX.setValueAtTime(xPos, audioCtx.currentTime);
  listener.positionY.setValueAtTime(yPos, audioCtx.currentTime);
  listener.positionZ.setValueAtTime(300, audioCtx.currentTime);
} else {
  listener.setPosition(xPos,yPos,300);
}

// listenerData.innerHTML = 'Listener data: X ' + xPos + ' Y ' + yPos + ' Z ' + 300;

// panner will move as the boombox graphic moves around on the screen
function positionPanner() {
  if(panner.positionX) {
    panner.positionX.setValueAtTime(xPos, audioCtx.currentTime);
    panner.positionY.setValueAtTime(yPos, audioCtx.currentTime);
    panner.positionZ.setValueAtTime(zPos, audioCtx.currentTime);
  } else {
    panner.setPosition(xPos,yPos,zPos);
  }
  // pannerData.innerHTML = 'Panner data: X ' + xPos + ' Y ' + yPos + ' Z ' + zPos;
}
/*jshint esversion: 6 */
/*jshint browser: true */
/*jshint devel: true */

const $ = (query) => document.querySelector(query);

const sphere = $('a-sphere');
const plane = $('a-plane');

const shiftDegrees = (value) => (value + 1) % 360;

let degrees = 0;

const animate = () => {
  degrees = shiftDegrees(degrees);
  const color = `hsl(${degrees}, 100%, 50%)`;
  const variation = Math.sin(Date.now() / 1000);
  const position = `0 ${1.5 + variation} -2`;
  const rotation = `-90 0 ${degrees}`;

  sphere.setAttribute('color', color);
  sphere.setAttribute('position', position);

  // plane.setAttribute('color', color);
  // plane.setAttribute('rotation', rotation);

  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);