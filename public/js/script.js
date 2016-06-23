var stick = new VirtualJoystick({
  //mouseSupport: true,
  container: document.getElementById("stickContainer"),
  strokeStyle: 'blue',
  limitStickTravel: true
});

stick.addEventListener('touchStartValidation', function(event){
  var touch	= event.changedTouches[0];
  //console.log(touch.pageX, touch.pageY);
  //if( touch.pageX >= window.innerWidth/2 &&  touch.pageY > window.innerHeight/2)	return true;
  return true;
});

var greater = function(a, b) {
  return a > b ? a : b;
};


var lesser = function(a, b) {
  return a > b ? b : a;
};

var listener = new window.keypress.Listener();

var socket = io();
socket.emit('newUser');

var commands = [
  {"com": "forward", "key": "up" },
  {"com": "left", "key": "left" },
  {"com": "right", "key": "right" },
  {"com": "reverse", "key": "down" },
  {"com": "stop", "key": "space" },
  {"com": "drive", "key": "d" },
];

var lastLeft, lastRight;

setInterval(function(){
  var left, right;
  var outputEl	= document.getElementById('result');

  var rawForward = Number(stick.deltaY());
  var rawAlt = Number(stick.deltaX());

  if (rawForward === 0 && rawAlt === 0) {
    socket.emit("stop");
    return;
  }

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
      socket.emit("stop");
    } else {
      socket.emit("drive", {left: left, right: right});
    }

    lastLeft = left;
    lastRight = right;
  }

  outputEl.innerHTML	= "left: " + left + " right: " + right;

}, 1/10 * 1000);

// Loop through our commands
commands.forEach( function(command) {
  command.el = document.getElementById(command.com);

  command.el.addEventListener("touchstart", function() {
    socket.emit(command.com);
    return false;
  });

  command.el.addEventListener("touchend", function() {
    socket.emit("stop");
  });

  // Listen for keypress events
  listener.register_combo({
    "keys"              : command.key,
    "on_keydown"        : function() { socket.emit(command.com); },
    "on_release"        : function() { socket.emit("stop"); },
    "prevent_default"   : true,
    "prevent_repeat"    : true
  });
});

// Bind event to window so the event works even when the mouse is outside browser
document.addEventListener("mouseup", function() {
    socket.emit("stop");
});

setInterval(function() {
  socket.emit("heartbeat");
}, 1000);
