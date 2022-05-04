var DEBUG = true;
function logger(...args) {
    if (DEBUG) {
        console.log(...args)
    }
}

// const socket = io(URL, { autoConnect: false });

const URL = "http://localhost:8080";
const socket = io.connect(URL, {
    reconnection: false
});

socket.on('connect', () => {
    logger("socket connected!");
});

let user_name = sessionStorage.getItem("nickname");
let user_data = {
    name: user_name
}

logger("send 'user_join' event to server, nickname: ", user_name)
socket.emit('user_join',
    user_data
);

socket.on('user_player',
    function (data) {
        // logger("[event] user_player: ", data)
        // logger("[event] user_player: ", socket.id)
        UserPlayerCreate(data.player);
    }
);

socket.on('player_join',
    function (data) {
        // logger("[event] player_join: ", data)
        PlayerJoinCreate(data.player);
    }
);

socket.on('cur_players',
    function (players) {
        logger("[event] cur_players: ", players)
        InitCurrentPlayers(players);
    }
);

socket.on('player_leave',
    function (data) {
        // logger("[event] player_leave: ", data)
        RemovePlayer(data.id);
    }
);

socket.on('player_update',
    function (data) {
        // logger("[event] player_update: ", data)
        PlayerUpdate(data);
    }
);

socket.on('player_shoot',
    function (data) {
        logger("[event] player_shoot: ", data)
        PlayerShoot(data.bullet);
    }
);

socket.on('debug_event',
    function (data) {
        logger("[event][debug] msg: ", data)
    }
);

// ------------------------

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

function EmitPlayerShootEvent(vector) {
    // logger("[emit][event] player_shoot: ", vector)
    socket.emit('player_shoot', {
        vector: vector
    });
}

function EmitDebugServer() {
    // logger("[event][debug] send debug_server")
    socket.emit('debug_server');
}
