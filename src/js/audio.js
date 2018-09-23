// define variables

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;

var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');

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
        console.log(buffer);
        source.connect(audioCtx.destination);
        source.loop = true;
      },
      function(e){ console.log("Error with decoding audio data" + e.err); });
  }
  request.send();
}

getData();
// source.start(0);

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


// // dump script to pre element

// pre.innerHTML = myScript.innerHTML;