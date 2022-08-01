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
    playerUpdate();
    // sendMessages();
}

// ------------------------------

function sendMessages(event, msg) {
    if (TESTING_VAR) {
        TESTING_VAR = false;
        io.sockets.emit('debug_event', "AAAAAAAAAAAA");
    }
    if (event == "player_got_hit") {
        io.sockets.emit("player_got_hit", msg);
    }
}

// code for player part

var playersMap = {}

function playerUpdate() {
    currentTime = Date.now();

    for (var pId in playersMap) {
        if (playersMap.hasOwnProperty(pId)) {
            var player = playersMap[pId];
            // console.log(player);
            if (player.getIsAlive()) {
                while (player.messages.length > 0) {
                    const movement = player.messages.shift();
                    if (player.time + movement.deltaTime > currentTime) {
                        movement.deltaTime = currentTime - player.time;
                    }
                    player.time += movement.deltaTime;
                    player.moveHandler(movement);
                }

                data = {
                    id: player.getId(),
                    x: player.getX(),
                    y: player.getY(),
                    tickNumber: player.messages.tickNumber + 1 // TODO : Add in client
                }
                io.to(pId).emit('player_update', data);
            }
        }
    }

    // appproach 1.
    // send worldUpdate to each connected players without its own data
    for (var pId in playersMap) {
        if (playersMap.hasOwnProperty(pId)) {
            var player = playersMap[pId];
            worldUpdateMsg = {
                data: []
            }
            for (var pId2 in playersMap) {
                if (playersMap.hasOwnProperty(pId2)) {
                    if (pId === pId2) continue;

                    const other = playersMap[pId2];
                    worldUpdateMsg.data.push({
                        id: other.getId(),
                        x: other.getX(),
                        y: other.getY(),
                        angle: other.getAngle()
                    });
                }
            }
            io.to(pId).emit('world_update', worldUpdateMsg);
        }
    }

    // approach 2.
    // broadcast worldUpdate to all connected players
    // ...
}

function getPlayer(sid) {
    // sid is socket.id
    if (playersMap[sid] !== undefined && playersMap[sid] !== null) {
        return playersMap[sid];
    }
    return null;
}

function getPlayersArray() {
    let arr = Object.keys(playersMap).map((key) => playersMap[key]);
    return arr;
}

function createNewPlayer(name) {
    let pl = new Player(
        getRandomArbitrary(100, 900), // x
        getRandomArbitrary(100, 700), // y
        CFG.GC.PL_DEFAULT_SIZE, // size
        CFG.GC.PL_DEFAULT_SPEED,  // speed
        genRandomId(), // id
        color = {
            r: getRandomArbitrary(0, 230),
            g: getRandomArbitrary(50, 255), // to prevent black
            b: getRandomArbitrary(0, 230)
        },
        name, // name
        Date.now()
    );
    return pl;
}

function resetPlayer(socketId) {
    let pl = getPlayer(socketId);
    pl.setX(getRandomArbitrary(100, 900));
    pl.setY(getRandomArbitrary(100, 700));
    pl.setRadius(CFG.GC.PL_DEFAULT_SIZE);
    pl.setSpeed(CFG.GC.PL_DEFAULT_SPEED);
    pl.setAlive(true);
    return pl;
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
    if (pl !== null && pl.getIsAlive() && pl.canShoot()) {
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
        bullet.setOnFlight(true);
        pl.shoot();
        return bullet;
    }
    return null;
}

// ------- end for player part -------

// bullet part

function populateBulletPool() {
    for (let i = 0; i < CFG.GC.BLT_POOL; i++) {
        let bullet = new Bullet();
        bullet.setRadius(CFG.GC.BLT_SIZE);
        bulletPool.push(bullet);
    }
}

function updateBullets(delta) {
    bulletPool.forEach(bullet => {
        if (bullet.isOnFlight()) {
            bullet.update();

            let pId = bulletPlayersHit(bullet);
            if (pId != null) {
                let msg = {
                    bulletId: bullet.getPlayerId(),
                    playerId: pId,
                }
                sendMessages("player_got_hit", msg);
            }

            if (pId != null || bullet.isOutOfBounds()) {
                bullet.reset();
            }
        }
    });
}

function bulletPlayersHit(bullet) {
    for (var key of Object.keys(playersMap)) {
        let player = playersMap[key];
        if (player.getIsAlive() && player.getId() != bullet.getPlayerId()) {
            let isHit = circleColliderCheck(bullet, player);
            if (isHit) {
                // set player alive to false
                player.setAlive(false);

                return player.id;
            }
        }
    }
    return null;
}

// --------- end of bullet part -------

function inMessageHandler() {
    io.sockets.on('connection',
        // We are given a websocket object in our function
        function (socket) {

            socket.on('my_player_join',
                function (data) {
                    let name = data.name;
                    if (name == ""
                        || name == "undefined" // wtf firefox bug
                    ) {
                        name = genRandomName()
                    }

                    info(`[event] (socket id: ${socket.id}) user join: ${name}`);
                    socket.emit('cur_players', getPlayersArray());

                    // create new player
                    let pl = addPlayer(socket.id, name)

                    // send player data to joining user
                    socket.emit('your_player', {
                        player: pl,
                        name: name,
                    });
                    // broadcast player data to other users
                    socket.broadcast.emit('new_player_join', {
                        player: pl
                    });
                }
            );

            socket.on('my_player_retry',
                function () {
                    // retry player will have same actions as player join
                    // reset its player data and send it to the player and broadcast to another player
                    let pl = resetPlayer(socket.id);
                    // console.log("resetplayer: ", pl)

                    // send player data to retrying user
                    socket.emit('your_player', {
                        player: pl,
                    });
                    // broadcast player data to other users
                    socket.broadcast.emit('new_player_join', {
                        player: pl
                    });
                }
            );

            socket.on('my_player_start',
                function () {
                    if (getPlayer(socket.id) !== null) {
                        pl = getPlayer(socket.id);
                        pl.setAlive(true);
                        data = {
                            id: pl.getId(),
                            alive: pl.getIsAlive()
                        }
                        io.sockets.emit('player_update', data);
                    }
                }
            );

            socket.on('player_move',
                function (msg) {
                    if (getPlayer(socket.id) !== null) {
                        pl = getPlayer(socket.id);
                        if (pl !== null && pl.getIsAlive()) {
                            pl.messages.push(msg.direction);
                        }
                        // if (pl.moveHandler(msg.direction)) {
                        //     data = {
                        //         id: pl.getId(),
                        //         x: pl.getX(),
                        //         y: pl.getY()
                        //     }
                        //     io.sockets.emit('player_update', data);
                        // }
                    }
                }
            );

            socket.on('player_angle',
                function (msg) {
                    let pl = getPlayer(socket.id);
                    if (pl !== null && pl.getIsAlive()) {
                        pl.setAngle(msg.angle);
                        data = {
                            id: pl.getId(),
                            angle: pl.getAngle()
                        }
                        // io.sockets.emit('player_update', data);
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
                console.log("======================");
                console.log("curr players array: ", getPlayersArray());
                console.log("----------------------");
                debug("debug_event sent from client")
                TESTING_VAR = true;
            });
        }
    );
}

module.exports = function () {
    this.GameServer = GameServer
}