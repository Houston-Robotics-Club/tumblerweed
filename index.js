var Five = require("johnny-five");
var Tessel = require("tessel-io");
var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
  port: 80
});

// Add the route
server.route([
  {
    method: 'GET',
    path:'/',
    handler: {
      file: function (request) {
        return "public/html/user.html";
      }
    }
  },
  {
    method: 'GET',
    path:'/{filename}',
    handler: {
      file: function (request) {
        return "public/html/"+request.params.filename;
      }
    }
  },
  {
    method: 'GET',
    path:'/{folder}/{filename}',
    handler: {
      file: function (request) {
        return "public/"+request.params.folder+"/"+request.params.filename;
      }
    }
  }
]);

// Start the server
server.start();
var io = require('socket.io')(server.listener);
var activeUser = null;

var commands = {  // Note: can have invalid commands here
  bot: ['left', 'right', 'forward', 'reverse', 'stop']
};

var boardOpts = {
  io: new Tessel()
};

var board = new Five.Board(boardOpts);

board.on("ready", function() {
  console.log("ready");
});
