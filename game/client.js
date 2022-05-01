var socket;

socket = io.connect('http://localhost:8080');
let user_name = sessionStorage.getItem("nickname");
let user_data = {
    name: user_name
}
// console.log("send 'user_join' event to server, nickname: ", user_name)
socket.emit('user_join', user_data);

socket.on('user_player',
    function (main) {
        // console.log("[event] user_player: ", main)
        UserPlayerMessage(main);
    }
);

socket.on('player_join',
    function (player_data) {
        // console.log("[event] player_join: ", player_data)
        PlayerJoinMessage(player_data);
    }
);

socket.on('cur_players',
    function (players) {
        // console.log("[event] cur_players: ", players)
        InitCurrentPlayers(players);
    }
);

socket.on('player_leave',
    function (id) {
        // console.log("[event] player_leave: ", id)
        RemovePlayer(id);
    }
);

socket.on('player_update',
    function (data) {
        // console.log("[event] player_update: ", data)
        PlayerUpdate(data);
    }
);

function EmitPlayerMoveEvent(direction) {
    socket.emit('player_move',
        direction
    );
}

function EmitDebugServer() {
    socket.emit('debug_server');
}
