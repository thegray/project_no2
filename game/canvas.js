const GAME_STATE_ENUM = Object.freeze({ "INIT": 1, "READY": 2, "RUN": 3, "RETRY": 4 });

let MS_SPEED = 2,
    CHAR_RADIUS = 30,
    CANVAS_WIDTH, CANVAS_HEIGHT;

let mainChar;
let Characters = [];
let CharactersMap = {};
let BulletsFired = [];
let GameState = GAME_STATE_ENUM.INIT;

let gInput;
let inputsArray = [];
let inputHistory = [];
let historySize = 1024;
let tickNumber = 0;

let gServerMsgs = [];

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
    mainChar.update(); // this just to calculate angle and send it to server
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
        BulletsFired[i].update();
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

function initObjects() {
    mainChar = new character();
    gInput = new inputs();
    PlayerJoinEvent();
    GameReady();
}

function draw() {
    updateState();
    render();
}

function updateState() {
    updateController(deltaTime);
    charactersUpdate();
    bulletsUpdate();
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

function updateController(dt) {
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
    
    gInput.deltaTime = dt;
    const inputToSend = gInput.clone();
    inputsArray.push(inputToSend);
    PlayerInputEvent({
        tickNumber: tickNumber,
        inputsArray: inputsArray
    });

    inputsArray.length = 0;
    inputHistory[tickNumber % historySize] = {
        x: mainChar.getX(),
        y: mainChar.getY(),
        inputs: inputToSend
    };

    mainChar.move(gInput);

    // process msg from server part
    while (gServerMsgs.length > 0) {
        const msg = gServerMsgs.shift();

        switch (msg.type) {
            case 'pl_update':
                PlayerUpdate(msg.data);
                break;
                
            case 'wl_update':
                WorldUpdate(msg.data);
                break;
        }
    }

    tickNumber++;
}

function keyPressed() {
    if (keyCode === 87) { // w
        gInput.moveUp = true;
    }
    if (keyCode === 65) { // a
        gInput.moveLeft = true;
    }
    if (keyCode === 83) { // s
        gInput.moveDown = true;
    }
    if (keyCode === 68) { // d
        gInput.moveRight = true;
    }
    
    return false; // prevent any default behavior
}

function keyReleased() {
    if (keyCode === 87) { // w
        gInput.moveUp = false;
    }
    if (keyCode === 65) { // a
        gInput.moveLeft = false;
    }
    if (keyCode === 83) { // s
        gInput.moveDown = false;
    }
    if (keyCode === 68) { // d
        gInput.moveRight = false;
    }

    return false; // prevent any default behavior
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