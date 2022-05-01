function UserPlayerMessage(mainPlayer) {
    col = color(mainPlayer.color.r, mainPlayer.color.g, mainPlayer.color.b);
    mainChar.CharacterInit(mainPlayer.x, mainPlayer.y, mainPlayer.size, mainPlayer.speed, mainPlayer.id, col, mainPlayer.name);
    Characters.push(mainChar);
}

function PlayerJoinMessage(player) {
    nc = new character();
    col = color(player.color.r, player.color.g, player.color.b);
    nc.CharacterInit(player.x, player.y, player.size, player.speed, player.id, col, player.name);
    Characters.push(nc);
}

function InitCurrentPlayers(players) {
    let len = players.length
    if (players.length > 0) {
        for (var i = 0; i < len; i++) {
            nc = new character();
            let col = color(players[i].color.r, players[i].color.g, players[i].color.b);
            nc.CharacterInit(players[i].x, players[i].y, players[i].size, players[i].speed, players[i].id, col, players[i].name);
            Characters.push(nc);
        }
    }
}

function RemovePlayer(id) {
    console.log("id: ", id)
    let index = Characters.map(function (e) { return e.id; }).indexOf(id);
    if (index > -1) {
        Characters[index].ready = false;
        Characters.splice(index, 1);
    }
}