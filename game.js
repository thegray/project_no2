const Player = require('./player.js')
const Bullet = require('./bullet.js')
require('./common.js')();
var CFG = require('./config.js')
require('./logger.js')();
var io;

let tick = 1000 / CFG.GC.SERVER_TICK;
let prev = Date.now();

// var bulletPool = {
//     ready: [],
//     onFlight: []
// }
var bulletPool = [];

let GameServer = function (ioServer) {
    io = ioServer;
    gsInit(io);
    gsLoop();
}

var TESTING_VAR = false;

// var actualTicks = 0;
var gsLoop = function () {
    let now = Date.now();
    // actualTicks++;
    if (prev + tick <= now) {
        let delta = (now - prev) / 1000;
        prev = now;
        gameUpdate(delta);
        debug('delta', delta, '(target: ' + tick + ' ms)');
        // console.log('delta', delta, '(target: ' + tick + ' ms)', 'node ticks', actualTicks);
        // actualTicks = 0;
    }
    if (Date.now() - prev < tick - 16) {
        setTimeout(gsLoop);
    } else {
        setImmediate(gsLoop);
    }
}

// -----------------------------

function gsInit() {
    populateBulletPool();
    inMessageHandler();
}

function gameUpdate(delta) {
    updateBullets(delta);
    sendMessages();
}

// ------------------------------

function sendMessages() {
    if (TESTING_VAR) {
        TESTING_VAR = false;
        io.sockets.emit('debug_event', "AAAAAAAAAAAA");
    }
}

// code for player part

var playersMap = {}

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
            r: getRandomArbitrary(0, 230),
            g: getRandomArbitrary(50, 255), // to prevent black
            b: getRandomArbitrary(0, 230)
        },
        name
    );
    return pl;
}

function getPlayer(sid) {
    // sid is socket.id
    if (playersMap[sid] !== undefined && playersMap[sid] !== null) {
        return playersMap[sid];
    }
    return null;
}

function addPlayer(sid, name) {
    // sid is socket.id
    let player = createNewPlayer(name);
    playersMap[sid] = player;
    return player;
}

function removePlayer(sid) {
    // sid is socket.id
    if (playersMap[sid] !== undefined && playersMap[sid] !== null) {
        let playerId = playersMap[sid].getId();
        delete playersMap[sid];
        return playerId;
    }
    return null;
}

function playerShoot(sid, vector) {
    // sid is socket.id
    let pl = getPlayer(sid);
    if (pl !== null) {
        // add check if not in cooldown, can shoot
        let tx = vector.x;
        let ty = vector.y;
        if (tx == null || ty == null) {
            return null;
        }
        // let tvector = pl.getCurrentTargetVector(tx, ty);
        let bullet = bulletPool[0];        
        bullet.setPlayerId(pl.getId());
        bullet.setX(pl.getX());
        bullet.setY(pl.getY());
        bullet.setVectorX(tx);
        bullet.setVectorY(ty);
        // bulletPool.onFlight.push(bullet);
        // bulletPool.ready.shift();
        bullet.setOnFlight(true);
        return bullet;
    }
    return null;
}

// ------- end for player part -------

// bullet part

function populateBulletPool() {
    for (let i = 0; i < CFG.GC.BLT_POOL; i++) {
        let bullet = new Bullet();
        // bulletPool.ready.push(bullet);
        bulletPool.push(bullet);
    }
}

function updateBullets(delta) {
    bulletPool.forEach(bullet => {
        if (bullet.isOnFlight()) {
            bullet.update();
            // add collision check
            // ...
            if (bullet.isOutOfBounds()) {
                bullet.reset();
            }
        }
    });
}

// --------- end of bullet part -------

function inMessageHandler() {
    io.sockets.on('connection',
        // We are given a websocket object in our function
        function (socket) {

            socket.on('user_join',
                function (data) {
                    let name = data.name;
                    info(`[event] (socket id: ${socket.id}) user join: ${name}`);
                    socket.emit('cur_players', getPlayersArray());

                    // create new player
                    let pl = addPlayer(socket.id, name)

                    // broadcast player data to other users
                    socket.emit('user_player', {
                        player: pl
                    });
                    socket.broadcast.emit('player_join', {
                        player: pl
                    });
                });

            socket.on('player_move',
                function (msg) {
                    if (getPlayer(socket.id) !== null) {
                        pl = getPlayer(socket.id);
                        pl.inputHandler(msg.direction);
                        data = {
                            id: pl.getId(),
                            x: pl.getX(),
                            y: pl.getY()
                        }
                        io.sockets.emit('player_update', data);
                    }
                }
            );

            socket.on('player_angle',
                function (msg) {
                    let pl = getPlayer(socket.id);
                    if (pl !== null) {
                        pl.setAngle(msg.angle);
                        data = {
                            id: pl.getId(),
                            angle: pl.getAngle()
                        }
                        io.sockets.emit('player_update', data);
                    }
                }
            );

            socket.on('player_shoot',
                function (val) {
                    let blt = playerShoot(socket.id, val.vector);
                    if (blt !== null) {
                        data = {
                            bullet: blt
                        }
                        io.sockets.emit('player_shoot', data);
                    }
                }
            );

            socket.on('disconnect', function () {
                info(`[event] (socket id: ${socket.id}) client has disconnected!`)
                let playerId = removePlayer(socket.id);
                if (playerId !== null) {
                    socket.broadcast.emit('player_leave', {
                        id: playerId
                    });
                }
            });

            socket.on('debug_server', function () {
                // console.log("======================");
                // console.log("curr players array: ", getPlayersArray());
                // console.log("----------------------");
                debug("debug_event sent from client")
                TESTING_VAR = true;
            });
        }
    );
}

module.exports = function () {
    this.GameServer = GameServer
}