let MS_SPEED = 2,
    CHAR_RADIUS = 30,
    CANVAS_WIDTH, CANVAS_HEIGHT;

let mainChar;
let Characters = [];
let CharactersMap = {};
let BulletsFired = [];

function charactersUpdate() {
    mainChar.update();
}

function charactersRender() {
    // for (var i = 0; i < Characters.length; i++) {
    //     Characters[i].display();
    // }
    for (let [_, c] of Object.entries(CharactersMap)) {
        c.display();
    }
}

function bulletsUpdate() {
    for (var i = 0; i < BulletsFired.length; i++) {
        BulletsFired[i].update();
        if (BulletsFired[i].outOfBounds()) {
            // console.log("bullet out of bound", BulletsFired[i])
            BulletsFired.splice(i, 1);
        }
        // else if (BulletsFired[i].hitScan()) {
        //     BulletsFired.splice(i, 1);
        // }
    }
}

function bulletsRender() {
    for (var i = 0; i < BulletsFired.length; i++) {
        BulletsFired[i].display();
        // console.log("the bullet: ", BulletsFired[i])
    }
}

function eventsProcessor(event) {
    // let event = {
    //     type: 'keypress',
    //     value: 'x'
    //   };
    mainChar.inputHandler(event)
}

function setup() {
    iToTheta = TWO_PI / 3;
    CANVAS_WIDTH = 1024; //windowWidth; 
    CANVAS_HEIGHT = 800; //windowHeight;
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    initObjects();
}

function update() {
    updateController();
    charactersUpdate();
    bulletsUpdate();
}

function render() {
    background(color(50, 50, 50));
    drawReticle();
    charactersRender();
    bulletsRender();
}

function draw() {
    update();
    render();
}

function initObjects() {
    mainChar = new character();
    // characters.push(mainChar);
    // testChar = new character(200, 200, CHAR_RADIUS, MS_SPEED, 1, color(230, 255, 0));
    // characters.push(testChar);
}

function shoot() {
    let delta = (Date.now() - mainChar.lastShoot) / 1000;
    if (delta > mainChar.shootCooldown) {
        let mouseVector = mainChar.getMouseVector();
        oneBullet = new bullet(mainChar.getX(), mainChar.getY(),
            mouseVector.x, mouseVector.y,
            mainChar.getId(), mainChar.getColor());
        BulletsFired.push(oneBullet);
        mainChar.lastShoot = Date.now();
    }
    // let vector = {
    //     x: mouseVector.x,
    //     y: mouseVector.y
    // }
    // PlayerShootEvent(vector);
}

function updateController() {
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

    if (mouseIsPressed === true) {
        if (mouseButton === LEFT) {
            e.type = "mouseclick";
            e.value = "left";
            eventsProcessor(e);
            // shoot();
            // TriggerDebugServer();
        }
    }
}