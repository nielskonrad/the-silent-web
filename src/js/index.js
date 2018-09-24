/*jshint esversion: 6 */
/*jshint browser: true */
/*jshint devel: true */

var easeVal = 0,
  easing = 0.8;

function easeIt(val) {
  var targetX = val;
  var dx = targetX - easeVal;
  easeVal += dx * easing;
  return easeVal;
}

const $ = (query) => document.querySelector(query);

const sphere = $('a-sphere');
const beatBall = $('#beatBall');
const plane = $('a-plane');

const shiftDegrees = (value) => (value + 1) % 360;

let degrees = 0;

const animate = () => {
  degrees = shiftDegrees(degrees);
  const color = `hsl(${degrees}, 100%, 50%)`;
  const variation = Math.sin(Date.now() / 1000);
  const position = `${1.5 + variation} 0 -2`;
  const rotation = `-90 0 ${degrees}`;

  sphere.setAttribute('color', color);
  sphere.setAttribute('position', position);

  // console.log(beatBallRadius);
  var newVal = easeIt(beatBallRadius / 100);
  beatBall.setAttribute('radius', newVal);

  // plane.setAttribute('color', color);
  // plane.setAttribute('rotation', rotation);

  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);