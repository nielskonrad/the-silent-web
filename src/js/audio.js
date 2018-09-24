// define variables

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
// console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);

var sources = [];
var panners = [];

panners[0] = createPanner();
panners[1] = createPanner();

var canvas = document.getElementById('canvas');
var canvasCtx = canvas.getContext('2d');
var canvasW = canvas.width;
var canvasH = canvas.height;
var beatBallRadius = 0;

function drawGraph() {
  var fbc_array, bar_x, bar_width, bar_height, graphFill = '#000';
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  analyser.fftSize = 64;
  var bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength);
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.90;
  window.requestAnimationFrame(drawGraph);
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = 'hsla(0, 0%, 100%, 0)';
  canvasCtx.fillStyle = graphFill;
  canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  var barWidth = (canvasWidth / bufferLength);
  var barHeight;
  var x = 0;
  // Set size of Sphere
  beatBallRadius = dataArray[0]
  for (var i = 0; i < bufferLength; i++) { // used to be bufferLength
    barHeight = dataArray[i];
    canvasCtx.fillStyle = '#999'; // 'rgb(' + (barHeight+100) + ',50,50)'
    canvasCtx.fillRect(x, canvasHeight-barHeight/2, barWidth, barHeight/2);
    x += barWidth + 2;
  }
}

drawGraph();

function createPanner() {
  var panner = audioCtx.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;
  panner.connect(audioCtx.destination);
  return panner;
}

// analyser.connect(audioCtx.destination);

// Get sphere position
var sphereElem = document.querySelector('a-sphere');
// var sphereElem = document.querySelector('a-sphere');
var cameraElem = document.querySelector('#camera');
var camElem = document.querySelector("[camera]").getObject3D('camera')

function logSpherePosition () {
  var spherePos = sphereElem.getAttribute('position');
  var beatBallPos = beatBall.getAttribute('position');
  var cameraPos = cameraElem.getAttribute('position');
  var cameraRot = cameraElem.getAttribute('rotation');
  if (panners[0].positionX) {
    panners[0].positionX.value = spherePos.x;
    panners[0].positionY.value = spherePos.y;
    panners[0].positionZ.value = spherePos.z;
  }
  if (panners[1].positionX) {
    panners[1].positionX.value = spherePos.x;
    panners[1].positionY.value = spherePos.y;
    panners[1].positionZ.value = spherePos.z;
  }
  console.log(beatBall);
  // if (panner.orientationX) {
  //   panner.orientationX.value = 1;
  //   panner.orientationY.value = 0;
  //   panner.orientationZ.value = 0;
  // }
  if (listener.positionX) {
    listener.positionX.value = cameraPos.x;
    listener.positionY.value = cameraPos.y;
    listener.positionZ.value = cameraPos.z;
  }
  listener.setOrientation(cameraRot.x, cameraRot.y, cameraRot.z, camElem.up.x, camElem.up.y, camElem.up.z);
  // listener.forwardX.setValueAtTime(cameraRot.x, audioCtx.currentTime);
  // listener.forwardY.setValueAtTime(cameraRot.y, audioCtx.currentTime);
  // listener.forwardZ.setValueAtTime(cameraRot.z, audioCtx.currentTime);
  // console.log(cameraPos);
  // console.log(document.querySelector("[camera]").getObject3D('camera').up.x);
  window.requestAnimationFrame(logSpherePosition);  
}

window.requestAnimationFrame(logSpherePosition);

// if(panner.orientationX) {
//   panner.orientationX.value = 1;
//   panner.orientationY.value = 0;
//   panner.orientationZ.value = 0;
// } else {
//   panner.setOrientation(1,0,0);
// }

var listener = audioCtx.listener;

// if (listener.forwardX) {
//   listener.forwardX.value = 0;
//   listener.forwardY.value = 0;
//   listener.forwardZ.value = -1;
//   listener.upX.value = 0;
//   listener.upY.value = 1;
//   listener.upZ.value = 0;
// } else {
//   listener.setOrientation(0,0,-1,0,1,0);
// }

// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getData(index, src) {
  sources[index] = audioCtx.createBufferSource();
  var request = new XMLHttpRequest();
  // request.open('GET', '../audio/song-12.2.1_01.mp3', true);
  request.open('GET', '../audio/' + src.path, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
      sources[index].buffer = buffer;
      console.log(buffer);
      if (src.name == 'beat-one') {
        sources[index].connect(analyser);
        sources[index].connect(panners[0]);
      } else {
        sources[index].connect(panners[1]);
      }
      // sources[index].connect(analyser);
      // sources[index].connect(panner);
      // panner.connect(audioCtx.destination)
      sources[index].loop = src.isLoop;
      sources[index].start(0);
    },
    function(e){ console.log("Error with decoding audio data" + e.err); });
  }
  request.send();
}

var sounds = [
  {name: 'blauw', path: 'tsw-1.0_blauw.wav', isLoop: false},
  {name: 'braaaum', path: 'tsw-1.0_braaaum.wav', isLoop: true},
  {name: 'beat-one', path: 'tsw-1.0_beat-1a.wav', isLoop: true}
]

for (var i = 0; i < sounds.length; i++) {
  getData(i, sounds[i]);
}
// source.start(0);

// var sound_started = false;

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
// var WIDTH = window.innerWidth;
// var HEIGHT = window.innerHeight;

// var xPos = Math.floor(WIDTH/2);
// var yPos = Math.floor(HEIGHT/2);
// var zPos = 295;

// // define other variables

// var panner = audioCtx.createPanner();
// panner.panningModel = 'HRTF';
// panner.distanceModel = 'inverse';
// panner.refDistance = 1;
// panner.maxDistance = 10000;
// panner.rolloffFactor = 1;
// panner.coneInnerAngle = 360;
// panner.coneOuterAngle = 0;
// panner.coneOuterGain = 0;

// if(panner.orientationX) {
//   panner.orientationX.setValueAtTime(1, audioCtx.currentTime);
//   panner.orientationY.setValueAtTime(0, audioCtx.currentTime);
//   panner.orientationZ.setValueAtTime(0, audioCtx.currentTime);
// } else {
//   panner.setOrientation(1,0,0);
// }

// var listener = audioCtx.listener;

// if(listener.forwardX) {
//   listener.forwardX.setValueAtTime(0, audioCtx.currentTime);
//   listener.forwardY.setValueAtTime(0, audioCtx.currentTime);
//   listener.forwardZ.setValueAtTime(-1, audioCtx.currentTime);
//   listener.upX.setValueAtTime(0, audioCtx.currentTime);
//   listener.upY.setValueAtTime(1, audioCtx.currentTime);
//   listener.upZ.setValueAtTime(0, audioCtx.currentTime);
// } else {
//   listener.setOrientation(0,0,-1,0,1,0);
// }

// var source;

// var play = document.querySelector('.play');
// var stop = document.querySelector('.stop');

// var boomBox = document.querySelector('.boom-box');

// // var listenerData = document.querySelector('.listener-data');
// // var pannerData = document.querySelector('.panner-data');

// leftBound = (-xPos) + 50;
// rightBound = xPos - 50;

// xIterator = WIDTH/150;

// // listener will always be in the same place for this demo

// if(listener.positionX) {
//   listener.positionX.setValueAtTime(xPos, audioCtx.currentTime);
//   listener.positionY.setValueAtTime(yPos, audioCtx.currentTime);
//   listener.positionZ.setValueAtTime(300, audioCtx.currentTime);
// } else {
//   listener.setPosition(xPos,yPos,300);
// }

// // listenerData.innerHTML = 'Listener data: X ' + xPos + ' Y ' + yPos + ' Z ' + 300;

// // panner will move as the boombox graphic moves around on the screen
// function positionPanner() {
//   if(panner.positionX) {
//     panner.positionX.setValueAtTime(xPos, audioCtx.currentTime);
//     panner.positionY.setValueAtTime(yPos, audioCtx.currentTime);
//     panner.positionZ.setValueAtTime(zPos, audioCtx.currentTime);
//   } else {
//     panner.setPosition(xPos,yPos,zPos);
//   }
//   // pannerData.innerHTML = 'Panner data: X ' + xPos + ' Y ' + yPos + ' Z ' + zPos;
// }