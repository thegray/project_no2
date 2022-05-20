// from server to game part
function UserPlayerCreate(mainPlayer) {
    col = color(mainPlayer.color.r, mainPlayer.color.g, mainPlayer.color.b);
    mainChar.CharacterInit(mainPlayer.x, mainPlayer.y, mainPlayer.size, mainPlayer.speed, mainPlayer.id, col,
        mainPlayer.shootCooldown, mainPlayer.name);
    mainChar.setAlive(true);
    // Characters.push(mainChar);
    CharactersMap[mainChar.id] = mainChar;
}

function PlayerJoinCreate(player) {
    nc = new character();
    col = color(player.color.r, player.color.g, player.color.b);
    nc.CharacterInit(player.x, player.y, player.size, player.speed, player.id, col,
        player.shootCooldown, player.name);
    nc.setAlive(players.alive);
    // Characters.push(nc);
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
            // Characters.push(nc);
            CharactersMap[nc.id] = nc;
        }
    }
}

function PlayerUpdate(data) {
    if (data.id !== undefined) {
        let pl = CharactersMap[data.id];
        if (pl !== undefined) {
            if (data.x !== undefined) {
                pl.x = data.x;
            }
            if (data.y !== undefined) {
                pl.y = data.y;
            }
            if (data.angle !== undefined) {
                pl.angle = data.angle;
            }
        }
    } else {
        console.log("broken message on player_update!")
    }

}

function RemovePlayer(id) {
    // let index = Characters.map(function (e) { return e.id; }).indexOf(id);
    // if (index > -1) {
    //     Characters[index].alive = false;
    //     Characters.splice(index, 1);
    // }
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

function PlayerHit(data) {
    if (CharactersMap[data.playerId] !== undefined) {
        CharactersMap[data.playerId].setAlive(false);
    }
    RemoveBulletById(data.bulletId);
}

// ------- end of from server to game part ---------

// from game to server part

function PlayerMoveEvent(dir) {
    EmitPlayerMoveEvent(dir);
}

function PlayerAngleEvent(val) {
    EmitPlayerAngleEvent(val); // TODO: handle in gameloop
}

function PlayerShootEvent(val) {
    EmitPlayerShootEvent(val)
}

function TriggerDebugServer(dir) {
    EmitDebugServer();
}
// ---------------- end of server part ----------------