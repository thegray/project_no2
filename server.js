// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');

// Using the filesystem module
var fs = require('fs');

const Player = require('./player.js')

require('./common.js')();

var server = http.createServer(handleRequest);
server.listen(8080);

console.log('Server started on port 8080');

// var players = []
var playersMap = {}

function handleRequest(req, res) {

  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  } else if (pathname == '/game') {
    pathname = '/game/game.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // console.log("file: ", __dirname+pathname);
  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  );
}

// WebSocket Part
// WebSockets work with the HTTP server
const io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    socket.on('user_join',
      function (name) {
        console.log(`[event] (socket id: ${socket.id}) user join: ${name}`);
        socket.emit('cur_players', getPlayersArray());

        //create new player
        let pl = createNewPlayer(name);

        //return player data to user
        socket.emit('user_player', pl);
        // players.push(pl);
        playersMap[socket.id] = pl;

        //broadcast player data to other users
        socket.broadcast.emit('player_join', pl);
      });

    socket.on('player_move',
      function (direction) {
        // console.log(`[event] (socket id: ${socket.id}) player move: ${direction}`);
        // console.log("playersMap: ", playersMap)
        // console.log("----------------------")
        let pl = playersMap[socket.id]
        if (playersMap[socket.id] !== undefined) {
          // 1. works
          // let pl = playersMap[socket.id];
          // pl.inputHandler(data.direction);
          // playersMap[socket.id] = pl;

          // 2. works
          // playersMap[socket.id].inputHandler(data.direction);

          // 3.
          pl.inputHandler(direction);
        } else {
          return;
        }
        // console.log("playersMap: ", playersMap)
        // console.log("=======================")

        data = {
          id: pl.getId(),
          x: pl.getX(),
          y: pl.getY()
        }
        io.sockets.emit('player_update', data);
      }
    );

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function (data) {
        // Data comes in as whatever was sent, including objects
        console.log("[event] Received: 'mouse' " + data.x + " " + data.y);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('disconnect', function () {

      console.log(`[event] (socket id: ${socket.id}) client has disconnected!`)
      let player = playersMap[socket.id];
      if (player != undefined) {
        let playerId = player.getId();
        delete playersMap[socket.id];
        // let index = players.map(function (e) { return e.id; }).indexOf(playerId);
        // if (index > -1) {
        //   players.splice(index, 1);
        // }
        socket.broadcast.emit('player_leave', playerId);
      }
    });

    socket.on('debug_server', function () {
      // console.log("======================");
      // console.log("curr players array: ", getPlayersArray());
      // console.log("----------------------");
      // console.log("curr players array: ", players);
      // console.log("======================");
    })
  }
);

function getPlayersArray() {
  let arr = Object.keys(playersMap).map((key) => playersMap[key]);
  return arr;
}

function createNewPlayer(name) {
  let pl = new Player(
    getRandomArbitrary(100, 900),
    getRandomArbitrary(100, 700),
    30, //size
    2,  //speed
    genRandomId(),
    color = {
      r: getRandomArbitrary(0, 255),
      g: getRandomArbitrary(0, 255),
      b: getRandomArbitrary(0, 255)
    },
    name
  );

  return pl;
}