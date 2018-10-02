// define variables
// Create audio context and other audio nodes
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
analyser.connect(audioCtx.destination);
// analyser.fftSize = 256;

class Sound {
  constructor(name, path, loop) {
    this.name = name;
    this.path = path;
    this.loop = loop;
    this.panner = this.createPanner();
    this.source = this.createSource();
  }
  // Create the source
  createSource () {
    var source = audioCtx.createBufferSource()
    var request = new XMLHttpRequest();
    // console.log('../audio/' + this.path + ' vs: ' + '../audio/song-12.2.1_01.mp3');
    // console.log(analyser);
    // request.open('GET', '../audio/song-12.2.1_01.mp3', true);
    request.open('GET', '../audio/' + this.path, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      var audioData = request.response;
      audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;
        // console.log(buffer);
        if (this.name == 'beat-one') {
          source.connect(analyser);
          // source.connect(panners[0]);
        } else {
          source.connect(audioCtx.destination);
          // source.connect(analyser);
        }
        // sources[index].connect(analyser);
        // sources[index].connect(panner);
        // panner.connect(audioCtx.destination)
        source.loop = this.loop;
        source.start(0);
      },
      function(e){ console.log("Error with decoding audio data" + e.err); });
    }
    request.send();
    return source;
  }
  // Create it's panner node
  createPanner () {
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
}

let sounds = new Array(),
    source = [];

document.addEventListener("DOMContentLoaded", function(event) {
  sounds = [
    {name: 'blauw', path: 'tsw-1.0_blauw.wav', isLoop: false},
    {name: 'braaaum', path: 'tsw-1.0_braaaum.wav', isLoop: true},
    {name: 'beat-one', path: 'tsw-1.0_beat-1a.wav', isLoop: true}
  ];
  // Produce sources based on sound objects
  for (var i = 0; i < sounds.length; i++) {
    source[i] = new Sound(sounds[i].name, sounds[i].path, sounds[i].isLoop);
  };
});



// Get sphere position
var sphereElem = document.querySelector('a-sphere');
// var sphereElem = document.querySelector('a-sphere');
var cameraElem = document.querySelector('#camera');
// cameraElem.object3D.updateMatrixWorld();
// camP = new THREE.Vector3();
// setTimeout(function () {
//   camP.setFromMatrixPosition(cameraElem.matrixWorld);
// }, 4000)

var camElem = document.querySelector("[camera]").getObject3D('camera')

var listener = audioCtx.listener;

function getData(index, src) {
  
}

// for (var i = 0; i < sounds.length; i++) {
//   getData(i, sounds[i]);
// }

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
  console.log(canvasHeight-barHeight/2);
}

drawGraph();

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

// var sceneEl;

// AFRAME.registerComponent('master-scene', {
//   init: function () {
//     sceneEl = this.el;
//     console.log(sceneEl);
//   },
//   testSomethin: function () {
//     console.log('hey');
//   }
// });