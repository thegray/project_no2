function UserPlayerCreate(mainPlayer) {
    col = color(mainPlayer.color.r, mainPlayer.color.g, mainPlayer.color.b);
    mainChar.CharacterInit(mainPlayer.x, mainPlayer.y, mainPlayer.size, mainPlayer.speed, mainPlayer.id, col, mainPlayer.name);
    // Characters.push(mainChar);
    CharactersMap[mainChar.id] = mainChar;
}

function PlayerJoinCreate(player) {
    nc = new character();
    col = color(player.color.r, player.color.g, player.color.b);
    nc.CharacterInit(player.x, player.y, player.size, player.speed, player.id, col, player.name);
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
                pl.x = data.x
            }
            if (data.y !== undefined) {
                pl.y = data.y
            }
            if (data.angle !== undefined) {
                pl.angle = data.angle
            }
        }
    } else {
        console.log("broken message on player_update!")
    }

}

function RemovePlayer(id) {
    // let index = Characters.map(function (e) { return e.id; }).indexOf(id);
    // if (index > -1) {
    //     Characters[index].ready = false;
    //     Characters.splice(index, 1);
    // }
    if (CharactersMap[id] !== undefined) {
        delete CharactersMap[id];
    }
}

function PlayerMoveEvent(dir) {
    EmitPlayerMoveEvent(dir);
}

function PlayerAngleEvent(val) {
    EmitPlayerAngleEvent(val);
}

function TriggerDebugServer(dir) {
    EmitDebugServer();
}