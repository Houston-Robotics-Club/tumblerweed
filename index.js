// Configurable options --------------------
var pathToStaticFiles = "/app/remote-script/public/";
var heartbeatFrequency = 2000;
// -----------------------------------------

var http = require('http');
var url = require('url');
var router = require('routes')();
var fs = require('fs');
var bot = require('./lib/bot.js');

router.addRoute("/", user);
router.addRoute("/*", staticFile);

var server = http.createServer(function (req, res) {

  var path = url.parse(req.url).pathname;
  var match = router.match(path);

  match.fn(req, res, match);

}).listen(80);

var io = require('socket.io')(server);
var activeUser = null;

io.on('connection', function (socket) {
  var heartbeatTimer;

  // Generate handlers on the user's connection for each method on bot
  bot.commands.forEach(function(command){
    socket.on(command, function() {
      if (activeUser === socket) bot[command]();
    });
  });

  socket.on("heartbeat", function() {

    // Reset this user's heartbeat timer so the timeout is not called
    clearTimeout(heartbeatTimer);

    // Set the active user to this connection if there is no current active user
    if (activeUser === null) {
      activeUser = socket;
    }

    heartbeatTimer = setTimeout(function() {
      if (activeUser === socket) {
        bot.stop();
        activeUser = null;
      }
    }, heartbeatFrequency);

  });

});

function user(req, res, match) {
  res.statusCode = 200;
  var rstream = fs.createReadStream(pathToStaticFiles + 'html/index.html');
  rstream.pipe(res);
}

function staticFile(req, res, match) {
  fs.stat(pathToStaticFiles + match.splats[0], function(err, stats) {
    if (stats && stats.isFile()) {
      res.statusCode = 200;
      var rstream = fs.createReadStream(pathToStaticFiles + match.splats[0]);
      rstream.pipe(res);
    } else {
      res.statusCode = 404;
    }

  });

}
