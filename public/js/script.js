var stick = new VirtualJoystick({
  mouseSupport: false,
  container: document.getElementById("stick"),
  strokeStyle: 'blue',
  stationaryBase: true,
  baseX: window.innerWidth/2,
  baseY: window.innerHeight/4,
  limitStickTravel: true,
  stickRadius: 50
});

stick.addEventListener('touchStartValidation', function(event){
  var touch	= event.changedTouches[0];
  console.log(touch.pageX, touch.pageY);
  if( touch.pageX >= window.innerWidth/2 &&  touch.pageY > window.innerHeight/2)	return true;
  return false;
});

var listener = new window.keypress.Listener();

var socket = io();
socket.emit('newUser');

var commands = [
  {"com": "forward", "key": "up" },
  {"com": "left", "key": "left" },
  {"com": "right", "key": "right" },
  {"com": "reverse", "key": "down" },
  {"com": "stop", "key": "space" },
];

// Loop through our commands
commands.forEach( function(command) {
  command.el = document.getElementById(command.com);

  command.el.addEventListener("mousedown", function() {
    console.log(command.com);
    socket.emit(command.com);
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
