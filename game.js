const Player = require('./player.js')
require('./common.js')();
var CFG = require('./config.js')

var playersMap = {}
var bullets = []

function getPlayersArray() {
    let arr = Object.keys(playersMap).map((key) => playersMap[key]);
    return arr;
  }
  
  function createNewPlayer(name) {
    let pl = new Player(
      getRandomArbitrary(100, 900),
      getRandomArbitrary(100, 700),
      CFG.GC.PL_DEFAULT_SIZE, //size
      CFG.GC.PL_DEFAULT_SPEED,  //speed
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

let gsInit = function(server) {
    const io = require('socket.io')(server);

    io.sockets.on('connection',
        // We are given a websocket object in our function
        function (socket) {

            socket.on('user_join',
                function (data) {
                    let name = data.name;
                    console.log(`[event] (socket id: ${socket.id}) user join: ${name}`);
                    socket.emit('cur_players', getPlayersArray());

                    // create new player
                    let pl = createNewPlayer(name);

                    // return player data to user
                    socket.emit('user_player', {
                        player: pl
                    });
                    playersMap[socket.id] = pl;

                    // broadcast player data to other users
                    socket.broadcast.emit('player_join', {
                        player: pl
                    });
                });

            socket.on('player_move',
                function (msg) {
                    // console.log(`[event] (socket id: ${socket.id}) player move: ${msg.direction}`);
                    // console.log("playersMap: ", playersMap)
                    // console.log("----------------------")
                    let pl = playersMap[socket.id]
                    if (playersMap[socket.id] !== undefined) {
                        // 1. works
                        // let pl = playersMap[socket.id];
                        // pl.inputHandler(msg.direction);
                        // playersMap[socket.id] = pl;

                        // 2. works
                        // playersMap[socket.id].inputHandler(msg.direction);

                        // 3.
                        pl.inputHandler(msg.direction);
                        data = {
                            id: pl.getId(),
                            x: pl.getX(),
                            y: pl.getY()
                        }
                        io.sockets.emit('player_update', data);
                    }
                    // else {
                    //   return;
                    // }
                    // console.log("playersMap: ", playersMap)
                    // console.log("=======================")
                }
            );

            socket.on('player_angle',
                function (msg) {
                    let pl = playersMap[socket.id]
                    if (playersMap[socket.id] !== undefined) {
                        pl.setAngle(msg.angle);
                        data = {
                            id: pl.getId(),
                            angle: pl.getAngle()
                        }
                        io.sockets.emit('player_update', data);
                    }
                }
            );

            // // When this user emits, client side: socket.emit('otherevent',some data);
            // socket.on('mouse',
            //     function (data) {
            //         // Data comes in as whatever was sent, including objects
            //         console.log("[event] Received: 'mouse' " + data.x + " " + data.y);

            //         // Send it to all other clients
            //         socket.broadcast.emit('mouse', data);

            //         // This is a way to send to everyone including sender
            //         // io.sockets.emit('message', "this goes to everyone");

            //     }
            // );

            socket.on('disconnect', function () {

                console.log(`[event] (socket id: ${socket.id}) client has disconnected!`)
                let player = playersMap[socket.id];
                if (player != undefined) {
                    let playerId = player.getId();
                    delete playersMap[socket.id];
                    socket.broadcast.emit('player_leave', {
                        id: playerId
                    });
                }
            });

            socket.on('debug_server', function () {
                // console.log("======================");
                // console.log("curr players array: ", getPlayersArray());
                // console.log("----------------------");
            })
        }
    );
}

module.exports = function() {
    this.gameServerInit = gsInit
}