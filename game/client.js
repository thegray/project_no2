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

// handle current player main character
socket.on('your_player',
    function (data) {
        logger("[event] your_player: ", data)
        // logger("[event] user_player: ", socket.id)
        UserPlayerCreate(data.player);
        if (data.name != "") {
            sessionStorage.setItem("nickname", data.name);
        }
        
    }
);

// handle another player joining server 
socket.on('new_player_join',
    function (data) {
        logger("[event] new_player_join: ", data)
        PlayerJoinCreate(data.player);
    }
);

// handle current state of all players
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

// receive updates of a player
socket.on('player_update',
    function (data) {
        // logger("[event] player_update: ", data)
        PlayerUpdate(data);
    }
);

socket.on('player_shoot',
    function (data) {
        // logger("[event] player_shoot: ", data)
        PlayerShoot(data.bullet);
    }
);

socket.on('player_got_hit',
    function (data) {
        // logger("[event] player_got_hit: ", data)
        PlayerHit(data);
    }
);

socket.on('debug_event',
    function (data) {
        logger("[event][debug] msg: ", data)
    }
);

// ------------------------

// join socket server event
// just send name
function EmitPlayerJoinEvent() {
    let user_name = sessionStorage.getItem("nickname");
    let user_data = {
        name: user_name
    }
    logger("send 'my_player_join' event to server, nickname: ", user_name)
    socket.emit('my_player_join',
        user_data
    );
}

function EmitPlayerMoveEvent(dir) {
    // logger("send 'player_move' event")
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

function EmitPlayerRetryEvent() {
    socket.emit('my_player_retry', () => {
        logger("[emit][event] try retry");
    });
}

function EmitPlayerStartEvent() {
    socket.emit('my_player_start', () => {
        logger("[emit][event] start!");
    });
}

function EmitDebugServer() {
    // logger("[event][debug] send debug_server")
    console.log(mainChar)
    socket.emit('debug_server');
}
