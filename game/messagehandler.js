// from server to game part
function UserPlayerCreate(mainPlayer) {
    col = color(mainPlayer.color.r, mainPlayer.color.g, mainPlayer.color.b);
    mainChar.CharacterInit(mainPlayer.x, mainPlayer.y, mainPlayer.size, mainPlayer.speed, mainPlayer.id, col,
        mainPlayer.shootCooldown, mainPlayer.name);
    mainChar.setAlive(true);
    CharactersMap[mainChar.id] = mainChar;
}

function PlayerJoinCreate(player) {
    nc = new character();
    col = color(player.color.r, player.color.g, player.color.b);
    nc.CharacterInit(player.x, player.y, player.size, player.speed, player.id, col,
        player.shootCooldown, player.name);
    nc.setAlive(player.alive);
    CharactersMap[nc.id] = nc;
}

function InitCurrentPlayers(players) {
    let len = players.length
    if (players.length > 0) {
        for (var i = 0; i < len; i++) {
            nc = new character();
            let col = color(players[i].color.r, players[i].color.g, players[i].color.b);
            nc.CharacterInit(players[i].x, players[i].y, players[i].size, players[i].speed, players[i].id, col, players[i].name);
            nc.setAlive(players[i].alive);
            CharactersMap[nc.id] = nc;
        }
    }
}

function PlayerUpdate(data) {
    if (data.id !== undefined) {
        // let pl = CharactersMap[data.id];
        // if (pl !== undefined) {
        //     if (data.x !== undefined) {
        //         pl.x = data.x;
        //     }
        //     if (data.y !== undefined) {
        //         pl.y = data.y;
        //     }
        //     if (data.angle !== undefined) {
        //         pl.angle = data.angle;
        //     }
        //     if (data.alive !== undefined) {
        //         pl.alive = data.alive;
        //     }
        // }
        msg = {
            type: 'pl_update',
            data: data
        };
        gServerMsgs.push(msg);
    } else {
        console.log("broken message on player_update!")
    }
}

function WorldUpdate(data) {
    // if (data.length > 0) {
    //     for (let i = 0; i < data.length; i++) {
    //         let datum = data[i];
    //         let pl = CharactersMap[datum.id];
    //         if (pl !== undefined) {
    //             if (datum.x !== undefined) {
    //                 pl.x = datum.x;
    //             }
    //             if (datum.y !== undefined) {
    //                 pl.y = datum.y;
    //             }
    //             if (datum.angle !== undefined) {
    //                 pl.angle = datum.angle;
    //             }
    //         }
    //     }
    // }
    msg = {
        type: 'wl_update',
        data: data
    };
    gServerMsgs.push(msg);
}

function RemovePlayer(id) {
    if (CharactersMap[id] !== undefined) {
        delete CharactersMap[id];
    }
}

function PlayerShoot(blt) {
    if (blt != null) {
        // BulletsFired
        if (blt.playerId !== undefined) {
            let pl = CharactersMap[blt.playerId];
            if (pl !== undefined) {
                oneBullet = new bullet(blt.x, blt.y,
                    blt.vx, blt.vy,
                    blt.playerId, pl.getColor(), blt.radius);
                BulletsFired.push(oneBullet);
            }
        }

    }
}

// event handler of Player got hit by a bullet
function PlayerHit(data) {
    if (CharactersMap[data.playerId] !== undefined) {
        CharactersMap[data.playerId].setAlive(false);
        if (data.playerId == mainChar.getId()) {
            GamePauseForRetry();
        }
        RemovePlayer(data.playerId);
    }
    RemoveBulletById(data.bulletId);
}

// ------- end of from server to game part ---------

// from game to server part

function PlayerJoinEvent() {
    EmitPlayerJoinEvent();
}

function PlayerMoveEvent(dir) {
    EmitPlayerMoveEvent(dir);
}

function PlayerAngleEvent(val) {
    EmitPlayerAngleEvent(val); // TODO: handle in gameloop
}

function PlayerShootEvent(val) {
    EmitPlayerShootEvent(val)
}

function PlayerRetryEvent() {
    EmitPlayerRetryEvent();
}

function PlayerStartEvent() {
    EmitPlayerStartEvent();
}

function TriggerDebugServer(dir) {
    EmitDebugServer();
}

// ---- new

function PlayerInputEvent(msg) {
    EmitPlayerInputEvent(msg);
}
// ---------------- end of server part ----------------