const GAME_STATE_ENUM = Object.freeze({ "INIT": 1, "READY": 2, "RUN": 3, "RETRY": 4 });

let MS_SPEED = 2,
    CHAR_RADIUS = 30,
    CANVAS_WIDTH, CANVAS_HEIGHT;

let mainChar;
let Characters = [];
let CharactersMap = {};
let BulletsFired = [];
let GameState = GAME_STATE_ENUM.INIT;

function GameReady() {
    GameState = GAME_STATE_ENUM.READY;
}

function GameRun() {
    PlayerStartEvent();
    GameState = GAME_STATE_ENUM.RUN;
}

function GamePauseForRetry() {
    GameState = GAME_STATE_ENUM.RETRY;
}

function RetryGame() {
	EmitPlayerRetryEvent();
	GameRun();
}

function charactersUpdate() {
    mainChar.update();
}

function charactersRender() {
    for (let [_, c] of Object.entries(CharactersMap)) {
        c.display();
    }
}

function RemoveBulletById(id) {
    let i = BulletsFired.findIndex((bullet) => bullet.getCharId() == id);
    if (i > -1) {
        BulletsFired.splice(i, 1);
    }
}

function bulletsUpdate() {
    for (var i = 0; i < BulletsFired.length; i++) {
        BulletsFired[i].update(deltaTime);
        if (BulletsFired[i].outOfBounds()) {
            BulletsFired.splice(i, 1);
        }
    }
}

function bulletsRender() {
    for (var i = 0; i < BulletsFired.length; i++) {
        BulletsFired[i].display();
    }
}

function eventsProcessor(event) {
    mainChar.inputHandler(event)
}

function setup() {
    frameRate(60);
    iToTheta = TWO_PI / 3;
    CANVAS_WIDTH = 1024; //windowWidth; 
    CANVAS_HEIGHT = 800; //windowHeight;
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    initObjects();
}

function draw() {
    update(deltaTime);
    render();
}

function update(deltaTime) {
    if (deltaTime > 0.05) {
        deltaTime = 0.05;
    }
    updateController();
    charactersUpdate(deltaTime);
    bulletsUpdate(deltaTime);
}

function render() {
    background(color(50, 50, 50));
    charactersRender();
    bulletsRender();
    drawUI();
}

function drawUI() {
    switch (GameState) {
        case GAME_STATE_ENUM.INIT:
            console.log('init..');
            break;
        case GAME_STATE_ENUM.READY:
            UI_GameReady();
            break;
        case GAME_STATE_ENUM.RUN:
            UI_DrawReticle();
            break;
        case GAME_STATE_ENUM.RETRY:
            UI_GameOver();
            break;
        default:
            console.log(`Unknown state!`);
    }
}

function initObjects() {
    mainChar = new character();
    PlayerJoinEvent();
    GameReady();
}

function updateController() {
    if (keyIsDown(32)) { // space
        // TriggerDebugServer();
        if (GameState == GAME_STATE_ENUM.RETRY) {
            RetryGame();
            return
        }
        if (GameState == GAME_STATE_ENUM.READY) {
            GameRun();
            return
        }
    }
    let e = {}
    if (keyIsDown(87)) { // w
        e.type = "keypress";
        e.value = "up";
        eventsProcessor(e);
    }
    if (keyIsDown(65)) { // a
        e.type = "keypress";
        e.value = "left";
        eventsProcessor(e);
    }
    if (keyIsDown(83)) { // s
        e.type = "keypress";
        e.value = "down";
        eventsProcessor(e);
    }
    if (keyIsDown(68)) { // d
        e.type = "keypress";
        e.value = "right";
        eventsProcessor(e);
    }
}

function mouseClicked(event) {
    if (GameState != GAME_STATE_ENUM.RUN) {
        return
    }
    let e = {}
    e.type = "mouseclick";
    e.value = "left";
    eventsProcessor(e);
}