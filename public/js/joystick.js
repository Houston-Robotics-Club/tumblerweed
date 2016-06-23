var stick = new VirtualJoystick({
  mouseSupport: true,
  container: document.getElementById("stickContainer"),
  strokeStyle: 'blue',
  limitStickTravel: true
});

stick.addEventListener('touchStartValidation', function(event){
  var touch	= event.changedTouches[0];
  console.log(touch.pageX, touch.pageY);
  if( touch.pageX >= window.innerWidth/2 &&  touch.pageY > window.innerHeight/2)	return true;
  return false;
});

var greater = function(a, b) {
  return a > b ? a : b;
};


var lesser = function(a, b) {
  return a > b ? b : a;
};

var lastLeft, lastRight;

setInterval(function(){
  var quad, left, right;
  var outputEl	= document.getElementById('result');

  var rawForward = Number(stick.deltaY());
  var rawAlt = Number(stick.deltaX());

  var maxDiff = rawForward < 0 ? (-100 - rawForward) : (100 - rawForward);

  var diff = rawAlt >= 0 ? lesser(maxDiff, rawAlt): greater(maxDiff, rawAlt);

  if ((rawForward < 0 && rawAlt > 0) || (rawForward > 0 && rawAlt < 0)) {
    left = rawForward + diff;
    right = rawForward - diff;
  }
  if ((rawForward < 0 && rawAlt < 0) || (rawForward > 0 && rawAlt > 0)) {
    left = rawForward - diff;
    right = rawForward + diff;
  }

  if (left != lastLeft || right != lastRight) {
    if (left === 0 && right === 0) {
      //socket.emit("stop");
    }
    //socket.emit("drive", {left: left, right: right});

    lastLeft = left;
    lastRight = right;
  }

  outputEl.innerHTML	=
    "left: " + left
    + " right: " + right;

}, 1/10 * 1000);
