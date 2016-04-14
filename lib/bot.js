var Five = require("johnny-five");
var Tessel = require("tessel-io");

var boardOpts = {
  io: new Tessel()
};

var board = new Five.Board(boardOpts);

var bot = {
  commands: ['left', 'right', 'forward', 'reverse', 'stop']
};

board.on("ready", function() {

  var rearRight = new Five.Servo({ controller: "PCA9685", port: "A", address: 0x73, pin: 1, type: "continuous" });
  var rearLeft = new Five.Servo({ controller: "PCA9685", port: "A", address: 0x73, pin: 0, type: "continuous" });
  var frontRight = new Five.Servo({ controller: "PCA9685", port: "A", address: 0x73, pin: 2, invert: true, type: "continuous" });
  var frontLeft = new Five.Servo({ controller: "PCA9685", port: "A", address: 0x73, pin: 3, invert: true, type: "continuous" });

  var leftServos = new Five.Servos([rearLeft, frontLeft]);
  var rightServos = new Five.Servos([rearRight, frontRight]);
  var allServos = new Five.Servos([rearRight, frontRight, rearLeft, frontLeft]);

  bot.forward = function() { allServos.cw(1); };
  bot.reverse = function() { allServos.ccw(1); };
  bot.left = function() { rightServos.cw(1);leftServos.ccw(1); };
  bot.right = function() { rightServos.ccw(1);leftServos.cw(1); };
  bot.stop = function() { allServos.stop(); };

});

module.exports = bot;
