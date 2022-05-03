var socket;

socket = io.connect('http://localhost:8080');
let user_name = sessionStorage.getItem("nickname");
let user_data = {
    name: user_name
}
// console.log("send 'user_join' event to server, nickname: ", user_name)
socket.emit('user_join',
    user_data
);

socket.on('user_player',
    function (data) {
        // console.log("[event] user_player: ", data)
        UserPlayerCreate(data.player);
    }
);

socket.on('player_join',
    function (data) {
        // console.log("[event] player_join: ", data)
        PlayerJoinCreate(data.player);
    }
);

socket.on('cur_players',
    function (players) {
        // console.log("[event] cur_players: ", players)
        InitCurrentPlayers(players);
    }
);

socket.on('player_leave',
    function (data) {
        // console.log("[event] player_leave: ", data)
        RemovePlayer(data.id);
    }
);

socket.on('player_update',
    function (data) {
        // console.log("[event] player_update: ", data)
        PlayerUpdate(data);
    }
);

function EmitPlayerMoveEvent(dir) {
    socket.emit('player_move', {
        direction: dir
    });
}

function EmitPlayerAngleEvent(val) {
    socket.emit('player_angle', {
        angle: val
    });
}

function EmitDebugServer() {
    socket.emit('debug_server');
}
